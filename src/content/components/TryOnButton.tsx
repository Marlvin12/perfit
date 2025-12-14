import { useState } from 'react';
import type { Product } from '@/shared/types';

interface TryOnButtonProps {
  product: Product;
  onTryOn: () => void;
}

export function TryOnButton({ product, onTryOn }: TryOnButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onTryOn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="perfit-try-on-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        padding: '14px 24px',
        marginTop: '12px',
        background: isHovered
          ? 'linear-gradient(135deg, #dd5b10 0%, #ec751a 100%)'
          : 'linear-gradient(135deg, #ec751a 0%, #f09340 100%)',
        color: '#fff',
        fontSize: '15px',
        fontWeight: 600,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 6px 20px rgba(236, 117, 26, 0.35)'
          : '0 4px 12px rgba(236, 117, 26, 0.25)',
      }}
      aria-label={`Try on ${product.name} virtually`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span>Try On with PerFit</span>
    </button>
  );
}

