import { API_BASE_URL } from '@/shared/constants';
import { storage } from '@/shared/storage';
import type { Avatar, Measurements, TryOnRequest, TryOnResult, User } from '@/shared/types';

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await storage.getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  async getAvatar(id: string): Promise<Avatar | null> {
    try {
      return await request<Avatar>(`/avatar/${id}`);
    } catch {
      return null;
    }
  },

  async createAvatar(photoBase64: string, measurements: Measurements): Promise<Avatar> {
    return request('/avatar/create', {
      method: 'POST',
      body: JSON.stringify({ photo: photoBase64, measurements }),
    });
  },

  async tryOn(req: TryOnRequest): Promise<TryOnResult> {
    return request('/try-on', {
      method: 'POST',
      body: JSON.stringify({
        avatarId: req.avatarId,
        product: req.product,
        selectedSize: req.selectedSize,
      }),
    });
  },

  async getSizeRecommendation(
    avatarId: string,
    productId: string,
    brand: string
  ): Promise<{ size: string; confidence: number }> {
    return request('/recommend/size', {
      method: 'POST',
      body: JSON.stringify({ avatarId, productId, brand }),
    });
  },

  async pollAvatarStatus(id: string): Promise<Avatar> {
    return request(`/avatar/${id}/status`);
  },

  async pollTryOnStatus(jobId: string): Promise<TryOnResult> {
    return request(`/try-on/${jobId}/status`);
  },
};

