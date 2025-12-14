export const API_BASE_URL = 'https://api.perfit.ai/v1';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'perfit_auth_token',
  REFRESH_TOKEN: 'perfit_refresh_token',
  USER: 'perfit_user',
  AVATAR: 'perfit_avatar',
  SETTINGS: 'perfit_settings',
  TRY_ON_HISTORY: 'perfit_try_on_history',
} as const;

export const SUPPORTED_SITES: Record<string, { name: string; pattern: RegExp }> = {
  amazon: { name: 'Amazon', pattern: /amazon\.(com|co\.uk|de|fr|es|it|co\.jp)/ },
  zara: { name: 'ZARA', pattern: /zara\.com/ },
  hm: { name: 'H&M', pattern: /hm\.com/ },
  asos: { name: 'ASOS', pattern: /asos\.com/ },
  uniqlo: { name: 'UNIQLO', pattern: /uniqlo\.com/ },
  nordstrom: { name: 'Nordstrom', pattern: /nordstrom\.com/ },
  gap: { name: 'GAP', pattern: /gap\.com/ },
  mango: { name: 'Mango', pattern: /mango\.com/ },
};

export const PRODUCT_CATEGORIES = [
  'top',
  'bottom',
  'dress',
  'outerwear',
  'swimwear',
  'activewear',
] as const;

export const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const FIT_PREFERENCES = ['fitted', 'regular', 'relaxed'] as const;

export const MAX_PHOTO_SIZE_MB = 10;
export const MIN_PHOTO_DIMENSION = 512;
export const AVATAR_GENERATION_TIMEOUT_MS = 60000;
export const TRY_ON_TIMEOUT_MS = 30000;

