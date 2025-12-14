import React, { useState } from 'react';
import type { AuthState, User } from '@/shared/types';

interface AuthPageProps {
  onSuccess: (authState: AuthState) => void;
}

type Mode = 'login' | 'register';

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const mockUser: User = {
      id: 'demo_user_1',
      email: email || 'demo@perfit.ai',
      name: name || email.split('@')[0] || 'Demo User',
      avatarId: null,
      createdAt: new Date().toISOString(),
    };

    await new Promise((resolve) => setTimeout(resolve, 800));

    onSuccess({
      isAuthenticated: true,
      user: mockUser,
      avatar: null,
    });
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-perfit-500 to-perfit-400 flex items-center justify-center shadow-lg shadow-perfit-500/20">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">PerFit</h1>
              <p className="text-sm text-surface-500">Virtual Fitting Room</p>
            </div>
          </div>

          <div className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  mode === 'login'
                    ? 'text-white bg-surface-800/50'
                    : 'text-surface-500 hover:text-surface-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  mode === 'register'
                    ? 'text-white bg-surface-800/50'
                    : 'text-surface-500 hover:text-surface-300'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required={mode === 'register'}
                    className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-white/5 text-white text-sm placeholder:text-surface-600 focus:outline-none focus:border-perfit-500/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-surface-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-white/5 text-white text-sm placeholder:text-surface-600 focus:outline-none focus:border-perfit-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-white/5 text-white text-sm placeholder:text-surface-600 focus:outline-none focus:border-perfit-500/50"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-perfit-500 to-perfit-400 text-white text-sm font-semibold shadow-lg shadow-perfit-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-perfit-500/40 transition-all"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-xs text-surface-500 text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-perfit-600 to-perfit-500 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">Try Before You Buy</h2>
          <p className="text-white/80 leading-relaxed">
            Create your personalized avatar and see exactly how clothes will look on you before making a purchase. No more returns, no more guessing.
          </p>

          <div className="mt-12 flex justify-center gap-8">
            <Stat value="60%" label="Fewer Returns" />
            <Stat value="3D" label="Avatar Tech" />
            <Stat value="AI" label="Size Recs" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/60 mt-1">{label}</p>
    </div>
  );
}

