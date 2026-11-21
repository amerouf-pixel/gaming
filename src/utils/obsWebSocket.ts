/**
 * Optional real local OBS WebSocket v5 client (obs-websocket 5.x built into OBS Studio 28+).
 * Connects strictly when the user clicks Connect to their own local OBS instance (e.g. ws://127.0.0.1:4455).
 * Never simulates a connection or fakes scenes/stream status.
 */

export interface ObsSceneInfo {
  sceneName: string;
  sceneIndex: number;
}

export interface ObsStreamStatus {
  outputActive: boolean;
  outputTimecode?: string;
}

export type ObsConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

async function sha256Base64(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hashBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function validateLocalObsWsUrl(rawUrl: string): { ok: boolean; normalized?: string; error?: string } {
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'ws:' && parsed.protocol !== 'wss:') {
      return { ok: false, error: 'Protocol must be ws:// or wss://.' };
    }
    const host = parsed.hostname.toLowerCase();
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
    if (!isLocal && parsed.protocol !== 'wss:') {
      return { ok: false, error: 'Remote OBS endpoints require wss:// TLS encryption.' };
    }
    return { ok: true, normalized: parsed.toString() };
  } catch {
    return { ok: false, error: 'Invalid WebSocket URL (expected e.g. ws://127.0.0.1:4455).' };
  }
}

interface PendingRequest {
  resolve: (data: Record<string, unknown>) => void;
  reject: (err: Error) => void;
}

export class LocalObsWebSocketClient {
  private ws: WebSocket | null = null;
  private pending = new Map<string, PendingRequest>();
  private reqCounter = 0;

  async connect(
    url: string,
    password: string,
    onClose?: (reason: string) => void
  ): Promise<{ obsWebSocketVersion: string }> {
    const validation = validateLocalObsWsUrl(url);
    if (!validation.ok || !validation.normalized) {
      throw new Error(validation.error || 'Invalid OBS WebSocket URL.');
    }

    this.disconnect();

    return new Promise((resolve, reject) => {
      let settled = false;
      let ws: WebSocket;
      try {
        ws = new WebSocket(validation.normalized!);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unable to open WebSocket connection.';
        reject(new Error(msg));
        return;
      }

      this.ws = ws;
      const timeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          this.disconnect();
          reject(
            new Error(
              'Connection timed out. Verify OBS Studio is running with Tools -> WebSocket Server enabled.'
            )
          );
        }
      }, 6000);

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(String(event.data)) as {
            op: number;
            d?: Record<string, unknown>;
          };

          // Op 0: Hello
          if (msg.op === 0 && msg.d) {
            const auth = msg.d.authentication as { challenge?: string; salt?: string } | undefined;
            let authentication: string | undefined;
            if (auth?.challenge && auth?.salt) {
              const secret = await sha256Base64(`${password}${auth.salt}`);
              authentication = await sha256Base64(`${secret}${auth.challenge}`);
            }

            ws.send(
              JSON.stringify({
                op: 1, // Identify
                d: {
                  rpcVersion: 1,
                  ...(authentication ? { authentication } : {}),
                },
              })
            );
            return;
          }

          // Op 2: Identified
          if (msg.op === 2 && msg.d) {
            clearTimeout(timeout);
            if (!settled) {
              settled = true;
              resolve({
                obsWebSocketVersion: String(msg.d.negotiatedRpcVersion || '5.x'),
              });
            }
            return;
          }

          // Op 7: RequestResponse
          if (msg.op === 7 && msg.d) {
            const requestId = String(msg.d.requestId || '');
            const pending = this.pending.get(requestId);
            if (pending) {
              this.pending.delete(requestId);
              const status = msg.d.requestStatus as { result?: boolean; comment?: string } | undefined;
              if (status?.result) {
                pending.resolve((msg.d.responseData as Record<string, unknown>) || {});
              } else {
                pending.reject(new Error(status?.comment || 'OBS request failed.'));
              }
            }
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        if (!settled) {
          settled = true;
          reject(
            new Error(
              'Unable to connect to OBS WebSocket. If this page runs over HTTPS, browsers may block insecure ws://127.0.0.1 unless OBS uses wss:// or localhost access is allowed.'
            )
          );
        }
      };

      ws.onclose = (ev) => {
        clearTimeout(timeout);
        for (const [, pending] of this.pending) {
          pending.reject(new Error('OBS connection closed.'));
        }
        this.pending.clear();
        if (!settled) {
          settled = true;
          reject(
            new Error(
              ev.code === 4009
                ? 'OBS authentication failed (incorrect WebSocket password).'
                : `OBS closed the connection (code ${ev.code}).`
            )
          );
        } else if (onClose) {
          onClose(ev.reason || `code ${ev.code}`);
        }
      };
    });
  }

  private sendRequest(requestType: string, requestData?: Record<string, unknown>): Promise<Record<string, unknown>> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error('Not connected to OBS WebSocket.'));
    }
    const requestId = `jitalx_obs_${++this.reqCounter}_${Date.now()}`;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`OBS request ${requestType} timed out.`));
      }, 5000);

      this.pending.set(requestId, {
        resolve: (data) => {
          clearTimeout(timer);
          resolve(data);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        },
      });

      this.ws!.send(
        JSON.stringify({
          op: 6,
          d: {
            requestType,
            requestId,
            ...(requestData ? { requestData } : {}),
          },
        })
      );
    });
  }

  async getSceneList(): Promise<{ currentProgramSceneName: string; scenes: ObsSceneInfo[] }> {
    const data = await this.sendRequest('GetSceneList');
    const rawScenes = Array.isArray(data.scenes) ? data.scenes : [];
    const scenes: ObsSceneInfo[] = rawScenes
      .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === 'object')
      .map((s) => ({
        sceneName: String(s.sceneName || ''),
        sceneIndex: Number(s.sceneIndex || 0),
      }))
      .filter((s) => Boolean(s.sceneName));

    return {
      currentProgramSceneName: String(data.currentProgramSceneName || ''),
      scenes,
    };
  }

  async setCurrentProgramScene(sceneName: string): Promise<void> {
    await this.sendRequest('SetCurrentProgramScene', { sceneName });
  }

  async getStreamStatus(): Promise<ObsStreamStatus> {
    const data = await this.sendRequest('GetStreamStatus');
    return {
      outputActive: Boolean(data.outputActive),
      outputTimecode: typeof data.outputTimecode === 'string' ? data.outputTimecode : undefined,
    };
  }

  disconnect(): void {
    if (this.ws) {
      try {
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.close();
      } catch {
        // ignore close errors
      }
      this.ws = null;
    }
    this.pending.clear();
  }
}
