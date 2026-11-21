import crypto from 'node:crypto';
import type { Express, Request, Response } from 'express';
import { extractBearerToken, verifyFirebaseIdToken } from './payments';

type OAuthProvider = 'twitch' | 'youtube';

interface PendingOAuthState {
  uid: string;
  provider: OAuthProvider;
  origin: string;
  expiresAt: number;
}

interface ActiveOAuthConnection {
  provider: OAuthProvider;
  handle: string;
  channelTitle: string;
  accessToken: string;
  connectedAt: number;
}

// Ephemeral in-memory state & session store (never exposed to browser localStorage)
const pendingStates = new Map<string, PendingOAuthState>();
const userConnections = new Map<string, Partial<Record<OAuthProvider, ActiveOAuthConnection>>>();

function cleanupExpiredStates(): void {
  const now = Date.now();
  for (const [key, val] of pendingStates.entries()) {
    if (val.expiresAt <= now) {
      pendingStates.delete(key);
    }
  }
}

function getBaseAppUrl(req: Request): string {
  const configured = (process.env.APP_URL || '').trim().replace(/\/+$/, '');
  if (configured) return configured;
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

function renderPopupCallbackHtml(params: {
  ok: boolean;
  provider: OAuthProvider;
  targetOrigin: string;
  handle?: string;
  channelTitle?: string;
  error?: string;
}): string {
  const safePayload = JSON.stringify({
    type: 'JITALX_OAUTH_RESULT',
    provider: params.provider,
    ok: params.ok,
    handle: params.handle || '',
    channelTitle: params.channelTitle || '',
    error: params.error || '',
  }).replace(/</g, '\\u003c');

  const safeOrigin = JSON.stringify(params.targetOrigin).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>JITALX OAuth</title></head>
<body style="background:#0a0910;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
  <div style="text-align:center;padding:24px;">
    <p style="font-size:14px;">${params.ok ? 'Connection completed. You can close this window.' : 'Authentication failed. You can close this window.'}</p>
  </div>
  <script>
    (function() {
      try {
        if (window.opener) {
          window.opener.postMessage(${safePayload}, ${safeOrigin});
        }
      } catch (e) {}
      setTimeout(function() { window.close(); }, 300);
    })();
  </script>
</body>
</html>`;
}

export function registerIntegrationRoutes(app: Express): void {
  // Public status + optional authenticated user connection check
  app.get('/api/integrations/status', async (req: Request, res: Response) => {
    const baseUrl = getBaseAppUrl(req);
    const twitchConfigured = Boolean(
      (process.env.TWITCH_CLIENT_ID || '').trim() && (process.env.TWITCH_CLIENT_SECRET || '').trim()
    );
    const youtubeConfigured = Boolean(
      (process.env.YOUTUBE_CLIENT_ID || '').trim() && (process.env.YOUTUBE_CLIENT_SECRET || '').trim()
    );

    let uid: string | null = null;
    const token = extractBearerToken(req);
    if (token) {
      try {
        const verified = await verifyFirebaseIdToken(token);
        uid = verified.uid;
      } catch {
        uid = null;
      }
    }

    const active = uid ? userConnections.get(uid) : undefined;

    res.json({
      twitchConfigured,
      youtubeConfigured,
      callbackUrls: {
        twitch: `${baseUrl}/api/oauth/twitch/callback`,
        youtube: `${baseUrl}/api/oauth/youtube/callback`,
      },
      connections: {
        twitch: active?.twitch
          ? { connected: true, handle: active.twitch.handle, channelTitle: active.twitch.channelTitle }
          : { connected: false },
        youtube: active?.youtube
          ? { connected: true, handle: active.youtube.handle, channelTitle: active.youtube.channelTitle }
          : { connected: false },
      },
    });
  });

  // Start Twitch OAuth 2.0 Authorization Code flow
  app.get('/api/oauth/twitch/url', async (req: Request, res: Response) => {
    const clientId = (process.env.TWITCH_CLIENT_ID || '').trim();
    const clientSecret = (process.env.TWITCH_CLIENT_SECRET || '').trim();
    if (!clientId || !clientSecret) {
      res.status(503).json({
        ok: false,
        error: 'Twitch OAuth is not configured on the server. Set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET.',
      });
      return;
    }

    const token = extractBearerToken(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'Sign in with Google first to link a Twitch channel.' });
      return;
    }

    let uid: string;
    try {
      const verified = await verifyFirebaseIdToken(token);
      uid = verified.uid;
    } catch (err) {
      res.status(401).json({ ok: false, error: err instanceof Error ? err.message : 'Invalid token.' });
      return;
    }

    cleanupExpiredStates();
    const baseUrl = getBaseAppUrl(req);
    const redirectUri = `${baseUrl}/api/oauth/twitch/callback`;
    const state = crypto.randomBytes(24).toString('hex');
    pendingStates.set(state, {
      uid,
      provider: 'twitch',
      origin: new URL(baseUrl).origin,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'user:read:email channel:read:subscriptions',
      state,
    });

    res.json({ ok: true, url: `https://id.twitch.tv/oauth2/authorize?${params.toString()}` });
  });

  // Twitch OAuth callback
  app.get('/api/oauth/twitch/callback', async (req: Request, res: Response) => {
    const baseUrl = getBaseAppUrl(req);
    const defaultOrigin = new URL(baseUrl).origin;
    const stateKey = typeof req.query.state === 'string' ? req.query.state : '';
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const pending = pendingStates.get(stateKey);
    pendingStates.delete(stateKey);

    if (!pending || pending.provider !== 'twitch' || pending.expiresAt <= Date.now()) {
      res.status(400).send(
        renderPopupCallbackHtml({
          ok: false,
          provider: 'twitch',
          targetOrigin: defaultOrigin,
          error: 'Invalid or expired OAuth state.',
        })
      );
      return;
    }

    const clientId = (process.env.TWITCH_CLIENT_ID || '').trim();
    const clientSecret = (process.env.TWITCH_CLIENT_SECRET || '').trim();
    if (!code || !clientId || !clientSecret) {
      res.status(400).send(
        renderPopupCallbackHtml({
          ok: false,
          provider: 'twitch',
          targetOrigin: pending.origin,
          error: 'Missing authorization code or Twitch credentials.',
        })
      );
      return;
    }

    try {
      const tokenResp = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${baseUrl}/api/oauth/twitch/callback`,
        }).toString(),
      });

      const tokenData = (await tokenResp.json()) as { access_token?: string };
      if (!tokenResp.ok || !tokenData.access_token) {
        throw new Error('Twitch token exchange failed.');
      }

      const userResp = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Client-Id': clientId,
        },
      });
      const userData = (await userResp.json()) as {
        data?: Array<{ login?: string; display_name?: string }>;
      };
      const profile = userData.data?.[0];
      const handle = profile?.login || 'twitch_creator';
      const channelTitle = profile?.display_name || handle;

      const existing = userConnections.get(pending.uid) || {};
      existing.twitch = {
        provider: 'twitch',
        handle,
        channelTitle,
        accessToken: tokenData.access_token,
        connectedAt: Date.now(),
      };
      userConnections.set(pending.uid, existing);

      res.status(200).send(
        renderPopupCallbackHtml({
          ok: true,
          provider: 'twitch',
          targetOrigin: pending.origin,
          handle,
          channelTitle,
        })
      );
    } catch (err) {
      res.status(502).send(
        renderPopupCallbackHtml({
          ok: false,
          provider: 'twitch',
          targetOrigin: pending.origin,
          error: err instanceof Error ? err.message : 'Twitch OAuth error.',
        })
      );
    }
  });

  // Disconnect Twitch
  app.post('/api/oauth/twitch/disconnect', async (req: Request, res: Response) => {
    const token = extractBearerToken(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'Unauthorized.' });
      return;
    }
    try {
      const verified = await verifyFirebaseIdToken(token);
      const existing = userConnections.get(verified.uid);
      if (existing?.twitch) {
        delete existing.twitch;
      }
      res.json({ ok: true });
    } catch {
      res.status(401).json({ ok: false, error: 'Invalid token.' });
    }
  });

  // Start YouTube (Google) OAuth 2.0 flow
  app.get('/api/oauth/youtube/url', async (req: Request, res: Response) => {
    const clientId = (process.env.YOUTUBE_CLIENT_ID || '').trim();
    const clientSecret = (process.env.YOUTUBE_CLIENT_SECRET || '').trim();
    if (!clientId || !clientSecret) {
      res.status(503).json({
        ok: false,
        error: 'YouTube OAuth is not configured on the server. Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET.',
      });
      return;
    }

    const token = extractBearerToken(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'Sign in with Google first to link a YouTube channel.' });
      return;
    }

    let uid: string;
    try {
      const verified = await verifyFirebaseIdToken(token);
      uid = verified.uid;
    } catch (err) {
      res.status(401).json({ ok: false, error: err instanceof Error ? err.message : 'Invalid token.' });
      return;
    }

    cleanupExpiredStates();
    const baseUrl = getBaseAppUrl(req);
    const redirectUri = `${baseUrl}/api/oauth/youtube/callback`;
    const state = crypto.randomBytes(24).toString('hex');
    pendingStates.set(state, {
      uid,
      provider: 'youtube',
      origin: new URL(baseUrl).origin,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      access_type: 'online',
      prompt: 'consent',
      state,
    });

    res.json({ ok: true, url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  });

  // YouTube OAuth callback
  app.get('/api/oauth/youtube/callback', async (req: Request, res: Response) => {
    const baseUrl = getBaseAppUrl(req);
    const defaultOrigin = new URL(baseUrl).origin;
    const stateKey = typeof req.query.state === 'string' ? req.query.state : '';
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const pending = pendingStates.get(stateKey);
    pendingStates.delete(stateKey);

    if (!pending || pending.provider !== 'youtube' || pending.expiresAt <= Date.now()) {
      res.status(400).send(
        renderPopupCallbackHtml({
          ok: false,
          provider: 'youtube',
          targetOrigin: defaultOrigin,
          error: 'Invalid or expired OAuth state.',
        })
      );
      return;
    }

    const clientId = (process.env.YOUTUBE_CLIENT_ID || '').trim();
    const clientSecret = (process.env.YOUTUBE_CLIENT_SECRET || '').trim();
    if (!code || !clientId || !clientSecret) {
      res.status(400).send(
        renderPopupCallbackHtml({
          ok: false,
          provider: 'youtube',
          targetOrigin: pending.origin,
          error: 'Missing authorization code or YouTube OAuth credentials.',
        })
      );
      return;
    }

    try {
      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${baseUrl}/api/oauth/youtube/callback`,
        }).toString(),
      });
      const tokenData = (await tokenResp.json()) as { access_token?: string };
      if (!tokenResp.ok || !tokenData.access_token) {
        throw new Error('YouTube token exchange failed.');
      }

      const channelResp = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
        { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
      );
      const channelData = (await channelResp.json()) as {
        items?: Array<{ snippet?: { title?: string; customUrl?: string } }>;
      };
      const snippet = channelData.items?.[0]?.snippet;
      const channelTitle = snippet?.title || 'YouTube Channel';
      const handle = snippet?.customUrl || channelTitle;

      const existing = userConnections.get(pending.uid) || {};
      existing.youtube = {
        provider: 'youtube',
        handle,
        channelTitle,
        accessToken: tokenData.access_token,
        connectedAt: Date.now(),
      };
      userConnections.set(pending.uid, existing);

      res.status(200).send(
        renderPopupCallbackHtml({
          ok: true,
          provider: 'youtube',
          targetOrigin: pending.origin,
          handle,
          channelTitle,
        })
      );
    } catch (err) {
      res.status(502).send(
        renderPopupCallbackHtml({
          ok: false,
          provider: 'youtube',
          targetOrigin: pending.origin,
          error: err instanceof Error ? err.message : 'YouTube OAuth error.',
        })
      );
    }
  });

  // Disconnect YouTube
  app.post('/api/oauth/youtube/disconnect', async (req: Request, res: Response) => {
    const token = extractBearerToken(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'Unauthorized.' });
      return;
    }
    try {
      const verified = await verifyFirebaseIdToken(token);
      const existing = userConnections.get(verified.uid);
      if (existing?.youtube) {
        delete existing.youtube;
      }
      res.json({ ok: true });
    } catch {
      res.status(401).json({ ok: false, error: 'Invalid token.' });
    }
  });
}
