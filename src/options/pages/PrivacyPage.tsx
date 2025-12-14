import React from 'react';

export function PrivacyPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-2">Privacy & Data</h1>
        <p className="text-surface-400">Control how your data is stored and used</p>
      </div>

      <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Data Storage</h2>
        </div>
        <div className="p-6 space-y-4">
          <DataItem
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
            title="Avatar Data"
            description="Your 3D avatar and body measurements"
            storage="Encrypted cloud storage"
          />
          <DataItem
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            }
            title="Photos"
            description="Photos uploaded for avatar creation"
            storage="Deleted after processing"
          />
          <DataItem
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            }
            title="Try-On History"
            description="Your recent virtual try-on results"
            storage="Stored for 30 days"
          />
          <DataItem
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            }
            title="Analytics"
            description="Anonymized usage analytics"
            storage="Aggregated, no personal data"
          />
        </div>
      </section>

      <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Privacy Controls</h2>
        </div>
        <div className="p-6 space-y-4">
          <PrivacyToggle
            title="Usage Analytics"
            description="Help improve PerFit by sharing anonymized usage data"
            defaultEnabled
          />
          <PrivacyToggle
            title="Product Recommendations"
            description="Receive personalized product suggestions based on your try-ons"
            defaultEnabled={false}
          />
          <PrivacyToggle
            title="Marketing Communications"
            description="Receive updates about new features and promotions"
            defaultEnabled={false}
          />
        </div>
      </section>

      <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Data Management</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Export Your Data</p>
              <p className="text-xs text-surface-500 mt-0.5">Download all your data in JSON format</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-surface-800 border border-white/5 text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-700 transition-colors">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Clear Try-On History</p>
              <p className="text-xs text-surface-500 mt-0.5">Remove all saved try-on results</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-surface-800 border border-white/5 text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-700 transition-colors">
              Clear
            </button>
          </div>
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Delete Account</p>
                <p className="text-xs text-surface-500 mt-0.5">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DataItem({
  icon,
  title,
  description,
  storage,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  storage: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-800/30">
      <div className="w-10 h-10 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-surface-500 mt-0.5">{description}</p>
      </div>
      <span className="px-2 py-1 rounded-md bg-surface-700/50 text-xs text-surface-400">{storage}</span>
    </div>
  );
}

function PrivacyToggle({
  title,
  description,
  defaultEnabled,
}: {
  title: string;
  description: string;
  defaultEnabled?: boolean;
}) {
  const [enabled, setEnabled] = React.useState(defaultEnabled ?? false);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-surface-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? 'bg-perfit-500' : 'bg-surface-700'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

