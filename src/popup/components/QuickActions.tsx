import React from 'react';

interface QuickActionsProps {
  hasAvatar: boolean;
  onSettings: () => void;
  onHelp: () => void;
}

export function QuickActions({ hasAvatar, onSettings, onHelp }: QuickActionsProps) {
  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          }
          label="Settings"
          onClick={onSettings}
        />
        <ActionButton
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          }
          label="Help"
          onClick={onHelp}
        />
      </div>

      {hasAvatar && (
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-perfit-500/10 to-perfit-400/5 border border-perfit-500/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-perfit-500/20 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec751a" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-surface-300 leading-relaxed">
                Browse any supported store and click <strong className="text-perfit-400">Try On</strong> to see how clothes fit you.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-800/50 border border-white/5 hover:bg-surface-800 hover:border-white/10 transition-all group"
    >
      <span className="text-surface-400 group-hover:text-perfit-400 transition-colors">{icon}</span>
      <span className="text-sm font-medium text-surface-300 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

