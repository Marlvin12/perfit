import type { Product, ProductCategory, SiteConfig } from '@/shared/types';
import { siteConfigs } from './sites';

interface DetectionResult {
  product: Product;
  buttonTarget: Element | null;
}

function getCurrentSiteConfig(): SiteConfig | null {
  const hostname = window.location.hostname;
  return siteConfigs.find((config) => hostname.includes(config.domain)) ?? null;
}

function extractText(selector: string): string {
  const el = document.querySelector(selector);
  return el?.textContent?.trim() ?? '';
}

function extractImages(selector: string): string[] {
  const elements = document.querySelectorAll(selector);
  const images: string[] = [];
  elements.forEach((el) => {
    const src = el.getAttribute('src') || el.getAttribute('data-src');
    if (src) {
      images.push(src.startsWith('//') ? `https:${src}` : src);
    }
  });
  return images;
}

function extractSizes(selector: string): string[] {
  const container = document.querySelector(selector);
  if (!container) return [];

  const sizes: string[] = [];
  const buttons = container.querySelectorAll('button, li, span, label');
  buttons.forEach((el) => {
    const text = el.textContent?.trim();
    if (text && /^(XXS|XS|S|M|L|XL|XXL|XXXL|\d{1,2})$/i.test(text)) {
      sizes.push(text.toUpperCase());
    }
  });
  return [...new Set(sizes)];
}

function extractPrice(selector: string): { amount: number; currency: string } {
  const el = document.querySelector(selector);
  const text = el?.textContent ?? '';
  const match = text.match(/([£$€¥])?(\d+[.,]?\d*)/);

  const currencyMap: Record<string, string> = {
    '$': 'USD',
    '£': 'GBP',
    '€': 'EUR',
    '¥': 'JPY',
  };

  return {
    amount: match ? parseFloat(match[2].replace(',', '.')) : 0,
    currency: match?.[1] ? currencyMap[match[1]] || 'USD' : 'USD',
  };
}

function inferCategory(name: string): ProductCategory {
  const lower = name.toLowerCase();

  if (/coat|jacket|blazer|cardigan|sweater|hoodie/.test(lower)) return 'outerwear';
  if (/dress|gown|romper|jumpsuit/.test(lower)) return 'dress';
  if (/pant|jean|trouser|short|skirt|legging/.test(lower)) return 'bottom';
  if (/shirt|top|blouse|tee|tank|polo|crop/.test(lower)) return 'top';
  if (/bikini|swimsuit|swim/.test(lower)) return 'swimwear';
  if (/sport|yoga|gym|workout|athletic/.test(lower)) return 'activewear';

  return 'unknown';
}

function trySchemaOrg(): Partial<Product> | null {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent ?? '');
      const product = Array.isArray(data) ? data.find((d) => d['@type'] === 'Product') : data;

      if (product?.['@type'] === 'Product') {
        return {
          name: product.name,
          brand: product.brand?.name ?? '',
          images: [product.image].flat().filter(Boolean),
          price: {
            amount: parseFloat(product.offers?.price ?? 0),
            currency: product.offers?.priceCurrency ?? 'USD',
          },
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function generateProductId(url: string, name: string): string {
  const hash = Array.from(url + name).reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);
  return `prod_${Math.abs(hash).toString(36)}`;
}

export function detectProduct(): DetectionResult | null {
  const config = getCurrentSiteConfig();
  if (!config) {
    return null;
  }

  const urlMatch = new RegExp(config.urlPattern).test(window.location.pathname);
  if (!urlMatch) {
    return null;
  }

  const container = document.querySelector(config.selectors.productContainer);
  if (!container) {
    return null;
  }

  const schemaData = trySchemaOrg();
  const name = schemaData?.name ?? extractText(config.selectors.productName);

  if (!name) {
    return null;
  }

  const images = schemaData?.images ?? extractImages(config.selectors.productImages);
  if (images.length === 0) {
    return null;
  }

  const product: Product = {
    id: generateProductId(window.location.href, name),
    name,
    brand: schemaData?.brand ?? config.name,
    category: inferCategory(name),
    price: schemaData?.price ?? extractPrice(config.selectors.productPrice),
    images,
    sizes: extractSizes(config.selectors.sizeSelector),
    selectedSize: null,
    color: '',
    material: null,
    url: window.location.href,
    siteId: config.domain,
  };

  const buttonTarget = document.querySelector(config.tryOnButtonTarget);

  return { product, buttonTarget };
}

