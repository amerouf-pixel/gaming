export type OverlayBgMode = 'chroma' | 'transparent' | 'sunset';
export type OverlayLayoutMode = 'landscape' | 'vertical';
export type OverlayCamPosition = 'bottom-right' | 'top-right' | 'left' | 'hidden';
export type OverlayCamSize = 'sm' | 'md' | 'lg';

export interface ParsedOverlayUrlParams {
  bgMode?: OverlayBgMode;
  layout?: OverlayLayoutMode;
  cleanMode?: boolean;
  profileId?: string;
  camPos?: OverlayCamPosition;
  camSize?: OverlayCamSize;
  waiting?: boolean;
  hideSignature?: boolean;
}

const VALID_CAM_POS: OverlayCamPosition[] = ['bottom-right', 'top-right', 'left', 'hidden'];
const VALID_CAM_SIZE: OverlayCamSize[] = ['sm', 'md', 'lg'];

export function parseOverlayUrlParams(search: string): ParsedOverlayUrlParams {
  const params = new URLSearchParams(search);
  const result: ParsedOverlayUrlParams = {};

  const bg = params.get('bg');
  if (bg === 'chroma' || bg === 'transparent' || bg === 'sunset') {
    result.bgMode = bg;
  } else if (bg === 'waiting') {
    result.bgMode = 'sunset';
    result.waiting = true;
  }

  const layout = params.get('layout');
  if (layout === 'vertical' || layout === '9:16') {
    result.layout = 'vertical';
  } else if (layout === 'landscape' || layout === '16:9') {
    result.layout = 'landscape';
  }

  const clean = params.get('clean');
  if (clean === '1' || clean === 'true') {
    result.cleanMode = true;
  } else if (clean === '0' || clean === 'false') {
    result.cleanMode = false;
  }

  const profile = params.get('profile')?.trim();
  if (profile && /^[a-zA-Z0-9_-]{1,64}$/.test(profile)) {
    result.profileId = profile;
  }

  const cam = params.get('cam');
  if (cam && VALID_CAM_POS.includes(cam as OverlayCamPosition)) {
    result.camPos = cam as OverlayCamPosition;
  } else if (cam === 'top-left' || cam === 'bottom-left') {
    result.camPos = 'left';
  }

  const camSize = params.get('camSize');
  if (camSize && VALID_CAM_SIZE.includes(camSize as OverlayCamSize)) {
    result.camSize = camSize as OverlayCamSize;
  }

  const waiting = params.get('waiting');
  if (waiting === '1' || waiting === 'true') {
    result.waiting = true;
  } else if (waiting === '0' || waiting === 'false') {
    result.waiting = false;
  }

  const hideSig = params.get('hideSig');
  if (hideSig === '1' || hideSig === 'true') {
    result.hideSignature = true;
  } else if (hideSig === '0' || hideSig === 'false') {
    result.hideSignature = false;
  }

  return result;
}

export function buildOverlayObsUrl(
  origin: string,
  options: {
    bgMode: OverlayBgMode;
    layout: OverlayLayoutMode;
    clean?: boolean;
    profileId?: string;
    camPos?: OverlayCamPosition;
    camSize?: OverlayCamSize;
    waiting?: boolean;
    hideSignature?: boolean;
  }
): string {
  const params = new URLSearchParams();
  params.set('bg', options.bgMode);
  params.set('layout', options.layout);
  if (options.clean !== false) params.set('clean', '1');
  if (options.profileId) params.set('profile', options.profileId);
  if (options.camPos) params.set('cam', options.camPos);
  if (options.camSize && options.camPos !== 'hidden') params.set('camSize', options.camSize);
  if (options.waiting && options.bgMode === 'sunset') params.set('waiting', '1');
  if (options.hideSignature) params.set('hideSig', '1');
  return `${origin.replace(/\/+$/, '')}/overlay?${params.toString()}`;
}
