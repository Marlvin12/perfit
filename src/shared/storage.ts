import { STORAGE_KEYS } from './constants';
import type { AuthState, Avatar, TryOnResult, User } from './types';

type StorageArea = 'local' | 'sync';

async function get<T>(key: string, area: StorageArea = 'local'): Promise<T | null> {
  const result = await chrome.storage[area].get(key);
  return result[key] ?? null;
}

async function set<T>(key: string, value: T, area: StorageArea = 'local'): Promise<void> {
  await chrome.storage[area].set({ [key]: value });
}

async function remove(key: string, area: StorageArea = 'local'): Promise<void> {
  await chrome.storage[area].remove(key);
}

export const storage = {
  async getAuthToken(): Promise<string | null> {
    return get<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  async setAuthToken(token: string): Promise<void> {
    return set(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    return set(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async getUser(): Promise<User | null> {
    return get<User>(STORAGE_KEYS.USER, 'sync');
  },

  async setUser(user: User): Promise<void> {
    return set(STORAGE_KEYS.USER, user, 'sync');
  },

  async getAvatar(): Promise<Avatar | null> {
    return get<Avatar>(STORAGE_KEYS.AVATAR, 'sync');
  },

  async setAvatar(avatar: Avatar): Promise<void> {
    return set(STORAGE_KEYS.AVATAR, avatar, 'sync');
  },

  async getAuthState(): Promise<AuthState> {
    const [user, avatar] = await Promise.all([
      this.getUser(),
      this.getAvatar(),
    ]);
    return {
      isAuthenticated: !!user,
      user,
      avatar,
    };
  },

  async getTryOnHistory(): Promise<TryOnResult[]> {
    const history = await get<TryOnResult[]>(STORAGE_KEYS.TRY_ON_HISTORY);
    return history ?? [];
  },

  async addTryOnResult(result: TryOnResult): Promise<void> {
    const history = await this.getTryOnHistory();
    const updated = [result, ...history].slice(0, 50);
    return set(STORAGE_KEYS.TRY_ON_HISTORY, updated);
  },

  async clearAuth(): Promise<void> {
    await Promise.all([
      remove(STORAGE_KEYS.AUTH_TOKEN),
      remove(STORAGE_KEYS.REFRESH_TOKEN),
      remove(STORAGE_KEYS.USER, 'sync'),
      remove(STORAGE_KEYS.AVATAR, 'sync'),
    ]);
  },
};

