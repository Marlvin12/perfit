import React from 'react';

interface LoginPromptProps {
  onLogin: () => void;
}

export function LoginPrompt({ onLogin }: LoginPromptProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-perfit-500/20 rounded-full blur-2xl" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-perfit-500 to-perfit-600 flex items-center justify-center shadow-2xl shadow-perfit-500/30">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-white mb-2">Welcome to PerFit</h2>
      <p className="text-sm text-surface-400 mb-6 max-w-[260px] leading-relaxed">
        Sign in to create your personal avatar and start trying on clothes virtually before you buy.
      </p>

      <button
        onClick={onLogin}
        className="w-full max-w-[240px] py-3 px-6 rounded-xl bg-gradient-to-r from-perfit-500 to-perfit-400 text-white text-sm font-semibold shadow-lg shadow-perfit-500/25 hover:shadow-perfit-500/40 transition-all hover:-translate-y-0.5"
      >
        Sign In to Get Started
      </button>

      <div className="mt-6 flex items-center gap-4">
        <Feature icon="sparkles" label="AI Avatars" />
        <Feature icon="shirt" label="Virtual Try-On" />
        <Feature icon="ruler" label="Size Recs" />
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    sparkles: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      </svg>
    ),
    shirt: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
    ruler: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-1.5 text-surface-500">
      {icons[icon]}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}

