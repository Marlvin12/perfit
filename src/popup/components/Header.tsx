import type { User } from '@/shared/types';

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="px-4 py-4 border-b border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-perfit-500 to-perfit-400 flex items-center justify-center shadow-lg shadow-perfit-500/20">
            <svg
              width="20"
              height="20"
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
            <h1 className="text-base font-semibold text-white tracking-tight">PerFit</h1>
            <p className="text-xs text-surface-500">Virtual Fitting Room</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-xs font-medium text-surface-300 uppercase">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

