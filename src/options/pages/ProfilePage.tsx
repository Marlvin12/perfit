import React from 'react';
import type { AuthState } from '@/shared/types';

interface ProfilePageProps {
  authState: AuthState;
}

export function ProfilePage({ authState }: ProfilePageProps) {
  const { user, avatar } = authState;

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-2">Profile</h1>
        <p className="text-surface-400">Manage your account and preferences</p>
      </div>

      <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Account Information</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-perfit-500/20 to-perfit-400/10 flex items-center justify-center text-2xl font-semibold text-perfit-400 uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <p className="text-surface-400">{user.email}</p>
              <p className="text-xs text-surface-500 mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Full Name" value={user.name} disabled />
            <InputField label="Email" value={user.email} disabled />
          </div>
        </div>
      </section>

      {avatar && (
        <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">Body Measurements</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <MeasurementCard label="Height" value={`${avatar.measurements.heightCm} cm`} />
              <MeasurementCard label="Weight" value={`${avatar.measurements.weightKg} kg`} />
              <MeasurementCard label="Chest" value={`${avatar.measurements.chestCm} cm`} />
              <MeasurementCard label="Waist" value={`${avatar.measurements.waistCm} cm`} />
              <MeasurementCard label="Hips" value={`${avatar.measurements.hipsCm} cm`} />
            </div>
          </div>
        </section>
      )}

      <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          <ToggleOption
            label="Size Recommendations"
            description="Show AI-powered size suggestions when browsing"
            defaultChecked
          />
          <ToggleOption
            label="Auto-detect Products"
            description="Automatically detect clothing products on supported sites"
            defaultChecked
          />
          <ToggleOption
            label="Try-On History"
            description="Save your virtual try-on history for quick access"
            defaultChecked
          />
        </div>
      </section>
    </div>
  );
}

function InputField({
  label,
  value,
  disabled,
}: {
  label: string;
  value: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-surface-400 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-white/5 text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-perfit-500/50"
      />
    </div>
  );
}

function MeasurementCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-surface-800/50 border border-white/5">
      <p className="text-xs text-surface-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ToggleOption({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked ?? false);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-surface-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-perfit-500' : 'bg-surface-700'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

