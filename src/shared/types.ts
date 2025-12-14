export interface User {
  id: string;
  email: string;
  name: string;
  avatarId: string | null;
  createdAt: string;
}

export interface Avatar {
  id: string;
  userId: string;
  thumbnailUrl: string;
  meshUrl: string;
  measurements: Measurements;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Measurements {
  heightCm: number;
  weightKg: number;
  chestCm: number;
  waistCm: number;
  hipsCm: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: Price;
  images: string[];
  sizes: string[];
  selectedSize: string | null;
  color: string;
  material: string | null;
  url: string;
  siteId: string;
}

export type ProductCategory =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'swimwear'
  | 'activewear'
  | 'unknown';

export interface Price {
  amount: number;
  currency: string;
}

export interface TryOnResult {
  id: string;
  avatarId: string;
  productId: string;
  imageUrl: string;
  thumbnailUrl: string;
  sizeRecommendation: SizeRecommendation;
  createdAt: string;
}

export interface SizeRecommendation {
  recommendedSize: string;
  confidence: number;
  alternatives: SizeAlternative[];
  fitAnalysis: FitAnalysis;
}

export interface SizeAlternative {
  size: string;
  fitDescription: string;
}

export interface FitAnalysis {
  chest: FitRating;
  waist: FitRating;
  hips: FitRating;
  length: FitRating;
}

export type FitRating =
  | 'Too tight'
  | 'Snug'
  | 'Good fit'
  | 'Slightly loose'
  | 'Too loose'
  | 'N/A';

export interface SiteConfig {
  domain: string;
  name: string;
  selectors: SiteSelectors;
  urlPattern: string;
  tryOnButtonTarget: string;
}

export interface SiteSelectors {
  productContainer: string;
  productName: string;
  productPrice: string;
  productImages: string;
  sizeSelector: string;
  sizeChart: string | null;
}

export type MessageType =
  | 'GET_AUTH_STATE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'GET_AVATAR'
  | 'CREATE_AVATAR'
  | 'TRY_ON'
  | 'GET_TRY_ON_RESULT'
  | 'DETECT_PRODUCT'
  | 'GET_SIZE_RECOMMENDATION';

export interface Message<T = unknown> {
  type: MessageType;
  payload?: T;
}

export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  avatar: Avatar | null;
}

export interface TryOnRequest {
  avatarId: string;
  product: Product;
  selectedSize: string;
}

