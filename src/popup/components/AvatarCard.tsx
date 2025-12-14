import type { Avatar } from '@/shared/types';

interface AvatarCardProps {
  avatar: Avatar | null;
  onCreateAvatar: () => void;
  onEditAvatar: () => void;
}

export function AvatarCard({ avatar, onCreateAvatar, onEditAvatar }: AvatarCardProps) {
  if (!avatar) {
    return (
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-800/80 to-surface-900/80 border border-white/5 p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-perfit-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-surface-800 border-2 border-dashed border-surface-600 flex items-center justify-center mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-surface-500"
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h3 className="text-sm font-semibold text-white mb-1">Create Your Avatar</h3>
            <p className="text-xs text-surface-400 mb-4 max-w-[200px]">
              Upload a photo and measurements to start trying on clothes virtually
            </p>

            <button
              onClick={onCreateAvatar}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-perfit-500 to-perfit-400 text-white text-sm font-semibold shadow-lg shadow-perfit-500/25 hover:shadow-perfit-500/40 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-800/80 to-surface-900/80 border border-white/5 p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-700 ring-2 ring-perfit-500/30">
              {avatar.thumbnailUrl ? (
                <img
                  src={avatar.thumbnailUrl}
                  alt="Your avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-surface-400"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-surface-900 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white mb-0.5">Your Avatar</h3>
            <p className="text-xs text-surface-400">Ready for virtual try-ons</p>

            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-perfit-500/15 text-perfit-400 text-[10px] font-medium">
                {avatar.measurements.heightCm}cm
              </span>
              <span className="px-2 py-0.5 rounded-md bg-surface-700/50 text-surface-400 text-[10px] font-medium">
                {avatar.measurements.weightKg}kg
              </span>
            </div>
          </div>

          <button
            onClick={onEditAvatar}
            className="w-9 h-9 rounded-xl bg-surface-700/50 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

