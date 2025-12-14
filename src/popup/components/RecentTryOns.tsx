import type { TryOnResult } from '@/shared/types';

interface RecentTryOnsProps {
  tryOns: TryOnResult[];
}

export function RecentTryOns({ tryOns }: RecentTryOnsProps) {
  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Recent Try-Ons</h2>
        <button className="text-xs text-perfit-400 hover:text-perfit-300 font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {tryOns.map((tryOn, index) => (
          <TryOnThumbnail key={tryOn.id} tryOn={tryOn} index={index} />
        ))}
      </div>
    </div>
  );
}

function TryOnThumbnail({ tryOn, index }: { tryOn: TryOnResult; index: number }) {
  const confidence = Math.round(tryOn.sizeRecommendation.confidence * 100);

  return (
    <div
      className="relative group cursor-pointer animate-slide-up"
      style={{ animationDelay: `${0.35 + index * 0.05}s` }}
    >
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-800 ring-1 ring-white/5 group-hover:ring-perfit-500/50 transition-all">
        {tryOn.thumbnailUrl ? (
          <img
            src={tryOn.thumbnailUrl}
            alt="Try-on result"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-surface-600">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm">
        <span className="text-[9px] font-semibold text-green-400">{confidence}%</span>
      </div>
    </div>
  );
}

