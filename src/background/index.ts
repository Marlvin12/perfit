import { createMessageHandler } from '@/shared/messaging';
import { storage } from '@/shared/storage';
import type { AuthState, Avatar, TryOnRequest, TryOnResult, User } from '@/shared/types';
import { api } from './api';

const messageHandler = createMessageHandler({
  async GET_AUTH_STATE(): Promise<AuthState> {
    return storage.getAuthState();
  },

  async LOGIN(payload: unknown): Promise<{ user: User; avatar: Avatar | null }> {
    const { email, password } = payload as { email: string; password: string };
    const { user, token, refreshToken } = await api.login(email, password);

    await storage.setAuthToken(token);
    await storage.setRefreshToken(refreshToken);
    await storage.setUser(user);

    let avatar: Avatar | null = null;
    if (user.avatarId) {
      avatar = await api.getAvatar(user.avatarId);
      if (avatar) {
        await storage.setAvatar(avatar);
      }
    }

    return { user, avatar };
  },

  async LOGOUT(): Promise<void> {
    await storage.clearAuth();
  },

  async GET_AVATAR(): Promise<Avatar | null> {
    return storage.getAvatar();
  },

  async CREATE_AVATAR(payload: unknown): Promise<Avatar> {
    const { photo, measurements } = payload as {
      photo: string;
      measurements: { heightCm: number; weightKg: number; chestCm: number; waistCm: number; hipsCm: number };
    };

    const avatar = await api.createAvatar(photo, measurements);
    await storage.setAvatar(avatar);

    const user = await storage.getUser();
    if (user) {
      await storage.setUser({ ...user, avatarId: avatar.id });
    }

    return avatar;
  },

  async TRY_ON(payload: unknown): Promise<TryOnResult> {
    const request = payload as TryOnRequest;
    const result = await api.tryOn(request);
    await storage.addTryOnResult(result);
    return result;
  },

  async GET_TRY_ON_RESULT(payload: unknown): Promise<TryOnResult | null> {
    const { id } = payload as { id: string };
    const history = await storage.getTryOnHistory();
    return history.find((r) => r.id === id) ?? null;
  },

  async GET_SIZE_RECOMMENDATION(payload: unknown): Promise<{ size: string; confidence: number }> {
    const { avatarId, productId, brand } = payload as {
      avatarId: string;
      productId: string;
      brand: string;
    };
    return api.getSizeRecommendation(avatarId, productId, brand);
  },
});

chrome.runtime.onMessage.addListener(messageHandler);

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/options/index.html?welcome=true') });
  }
});

console.log('[PerFit] Service worker initialized');

