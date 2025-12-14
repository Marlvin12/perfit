import React, { useEffect, useState } from 'react';
import { sendMessage } from '@/shared/messaging';
import type { AuthState, Product, TryOnResult } from '@/shared/types';

interface TryOnOverlayProps {
  product: Product;
  onClose: () => void;
}

type OverlayState = 'loading' | 'no-auth' | 'no-avatar' | 'size-select' | 'processing' | 'result' | 'error';

export function TryOnOverlay({ product, onClose }: TryOnOverlayProps) {
  const [state, setState] = useState<OverlayState>('loading');
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] ?? '');
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  async function checkAuthState() {
    const response = await sendMessage<void, AuthState>('GET_AUTH_STATE');
    if (!response.success || !response.data) {
      setState('no-auth');
      return;
    }
    setAuthState(response.data);
    if (!response.data.isAuthenticated) {
      setState('no-auth');
    } else if (!response.data.avatar) {
      setState('no-avatar');
    } else {
      setState('size-select');
    }
  }

  async function handleTryOn() {
    if (!authState?.avatar) return;

    setState('processing');
    const response = await sendMessage<
      { avatarId: string; product: Product; selectedSize: string },
      TryOnResult
    >('TRY_ON', {
      avatarId: authState.avatar.id,
      product,
      selectedSize,
    });

    if (!response.success || !response.data) {
      setError(response.error ?? 'Failed to generate try-on');
      setState('error');
      return;
    }

    setResult(response.data);
    setState('result');
  }

  function openOptions(path: string) {
    chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS', payload: { path } });
    const optionsUrl = chrome.runtime.getURL(`src/options/index.html${path}`);
    window.open(optionsUrl, '_blank');
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(9, 9, 11, 0.8)',
        backdropFilter: 'blur(8px)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        animation: 'perfit-fade-in 0.2s ease-out',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: state === 'result' ? '900px' : '480px',
          maxHeight: '90vh',
          margin: '20px',
          background: 'linear-gradient(180deg, #18181b 0%, #09090b 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          animation: 'perfit-slide-up 0.3s ease-out',
        }}
      >
        <Header product={product} onClose={onClose} />

        <div style={{ padding: '24px', minHeight: '300px' }}>
          {state === 'loading' && <LoadingState />}
          {state === 'no-auth' && <NoAuthState onLogin={() => openOptions('?login=true')} />}
          {state === 'no-avatar' && <NoAvatarState onCreate={() => openOptions('?create-avatar=true')} />}
          {state === 'size-select' && (
            <SizeSelectState
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
              onTryOn={handleTryOn}
              recommendation={result?.sizeRecommendation?.recommendedSize}
            />
          )}
          {state === 'processing' && <ProcessingState />}
          {state === 'result' && result && (
            <ResultState
              result={result}
              product={product}
              onTryAnother={() => setState('size-select')}
            />
          )}
          {state === 'error' && <ErrorState message={error} onRetry={() => setState('size-select')} />}
        </div>
      </div>
    </div>
  );
}

function Header({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ec751a 0%, #f09340 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <div style={{ color: '#fafafa', fontSize: '15px', fontWeight: 600 }}>PerFit Try-On</div>
          <div style={{ color: '#71717a', fontSize: '12px', marginTop: '2px' }}>
            {product.brand} - {product.name.slice(0, 40)}...
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: 'none',
          borderRadius: '8px',
          color: '#a1a1aa',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid rgba(236, 117, 26, 0.2)',
          borderTopColor: '#ec751a',
          animation: 'perfit-spin 0.8s linear infinite',
        }}
      />
      <div style={{ color: '#a1a1aa', marginTop: '16px', fontSize: '14px' }}>Loading...</div>
    </div>
  );
}

function NoAuthState({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px',
          borderRadius: '16px',
          background: 'rgba(236, 117, 26, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec751a" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h3 style={{ color: '#fafafa', fontSize: '18px', fontWeight: 600, margin: '0 0 8px' }}>Sign in to Try On</h3>
      <p style={{ color: '#71717a', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.5 }}>
        Create a free account to generate your personal avatar and try on clothes virtually.
      </p>
      <button onClick={onLogin} style={primaryButtonStyle}>
        Sign In or Create Account
      </button>
    </div>
  );
}

function NoAvatarState({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px',
          borderRadius: '16px',
          background: 'rgba(236, 117, 26, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec751a" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h3 style={{ color: '#fafafa', fontSize: '18px', fontWeight: 600, margin: '0 0 8px' }}>Create Your Avatar</h3>
      <p style={{ color: '#71717a', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.5 }}>
        Upload a photo and your measurements to create a personalized 3D avatar for virtual try-ons.
      </p>
      <button onClick={onCreate} style={primaryButtonStyle}>
        Create Avatar
      </button>
    </div>
  );
}

function SizeSelectState({
  sizes,
  selectedSize,
  onSelect,
  onTryOn,
  recommendation,
}: {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
  onTryOn: () => void;
  recommendation?: string;
}) {
  return (
    <div>
      <h3 style={{ color: '#fafafa', fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>Select Size</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 500,
              border: selectedSize === size ? '2px solid #ec751a' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              background: selectedSize === size ? 'rgba(236, 117, 26, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedSize === size ? '#ec751a' : '#a1a1aa',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
          >
            {size}
            {recommendation === size && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#22c55e',
                  color: '#fff',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                REC
              </span>
            )}
          </button>
        ))}
      </div>
      <button onClick={onTryOn} disabled={!selectedSize} style={primaryButtonStyle}>
        Try On This Size
      </button>
    </div>
  );
}

function ProcessingState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px' }}>
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(236, 117, 26, 0.2) 0%, rgba(240, 147, 64, 0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          animation: 'perfit-pulse 1.5s ease-in-out infinite',
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ec751a" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h3 style={{ color: '#fafafa', fontSize: '18px', fontWeight: 600, margin: '0 0 8px' }}>Generating Your Look</h3>
      <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>This usually takes 10-20 seconds...</p>
    </div>
  );
}

function ResultState({
  result,
  onTryAnother,
}: {
  result: TryOnResult;
  product: Product;
  onTryAnother: () => void;
}) {
  const { sizeRecommendation } = result;

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '3/4',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#27272a',
          }}
        >
          <img
            src={result.imageUrl}
            alt="Virtual try-on result"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
      <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
        <h3 style={{ color: '#fafafa', fontSize: '16px', fontWeight: 600, margin: '0 0 20px' }}>Fit Analysis</h3>

        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>
              {sizeRecommendation.recommendedSize}
            </div>
            <div>
              <div style={{ color: '#22c55e', fontSize: '13px', fontWeight: 600 }}>Recommended Size</div>
              <div style={{ color: '#71717a', fontSize: '12px' }}>
                {Math.round(sizeRecommendation.confidence * 100)}% confidence
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {Object.entries(sizeRecommendation.fitAnalysis).map(([area, rating]) => (
            <div key={area} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#a1a1aa', fontSize: '13px', textTransform: 'capitalize' }}>{area}</span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: rating === 'Good fit' ? '#22c55e' : rating.includes('loose') ? '#f59e0b' : '#ef4444',
                }}
              >
                {rating}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onTryAnother} style={{ ...secondaryButtonStyle, width: '100%' }}>
          Try Another Size
        </button>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px',
          borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h3 style={{ color: '#fafafa', fontSize: '18px', fontWeight: 600, margin: '0 0 8px' }}>Something went wrong</h3>
      <p style={{ color: '#71717a', fontSize: '14px', margin: '0 0 24px' }}>{message}</p>
      <button onClick={onRetry} style={primaryButtonStyle}>
        Try Again
      </button>
    </div>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #ec751a 0%, #f09340 100%)',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const secondaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  background: 'rgba(255, 255, 255, 0.05)',
  color: '#fafafa',
  fontSize: '14px',
  fontWeight: 500,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

