import React, { useCallback, useState } from 'react';
import type { AuthState, Avatar, Measurements } from '@/shared/types';

interface AvatarPageProps {
  authState: AuthState;
  onAvatarCreated: (authState: AuthState) => void;
}

type Step = 'upload' | 'measurements' | 'processing' | 'complete';

export function AvatarPage({ authState, onAvatarCreated }: AvatarPageProps) {
  const [step, setStep] = useState<Step>(authState.avatar ? 'complete' : 'upload');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurements>({
    heightCm: 170,
    weightKg: 65,
    chestCm: 92,
    waistCm: 76,
    hipsCm: 98,
  });
  const [error, setError] = useState<string>('');

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result.split(',')[1]);
      setError('');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleMeasurementChange = (key: keyof Measurements, value: number) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  async function handleCreateAvatar() {
    if (!photoBase64) return;

    setStep('processing');
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockAvatar: Avatar = {
      id: 'demo_avatar_1',
      userId: authState.user?.id ?? 'demo_user',
      thumbnailUrl: photoPreview ?? '',
      meshUrl: '',
      measurements,
      status: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newAuthState: AuthState = {
      ...authState,
      avatar: mockAvatar,
    };
    onAvatarCreated(newAuthState);
    setStep('complete');
  }

  function handleStartOver() {
    setStep('upload');
    setPhotoPreview(null);
    setPhotoBase64(null);
    setError('');
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-2">
          {authState.avatar ? 'Your Avatar' : 'Create Your Avatar'}
        </h1>
        <p className="text-surface-400">
          {authState.avatar
            ? 'View and manage your virtual avatar'
            : 'Upload a photo and enter your measurements to create a personalized avatar'}
        </p>
      </div>

      <StepIndicator current={step} />

      {step === 'upload' && (
        <UploadStep
          photoPreview={photoPreview}
          onPhotoSelect={handlePhotoSelect}
          onContinue={() => setStep('measurements')}
          error={error}
        />
      )}

      {step === 'measurements' && (
        <MeasurementsStep
          measurements={measurements}
          onChange={handleMeasurementChange}
          onBack={() => setStep('upload')}
          onCreate={handleCreateAvatar}
          error={error}
        />
      )}

      {step === 'processing' && <ProcessingStep />}

      {step === 'complete' && authState.avatar && (
        <CompleteStep avatar={authState.avatar} onStartOver={handleStartOver} />
      )}
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const steps = ['upload', 'measurements', 'processing', 'complete'];
  const currentIndex = steps.indexOf(current);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              index <= currentIndex
                ? 'bg-perfit-500 text-white'
                : 'bg-surface-800 text-surface-500'
            }`}
          >
            {index < currentIndex ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 transition-colors ${
                index < currentIndex ? 'bg-perfit-500' : 'bg-surface-800'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function UploadStep({
  photoPreview,
  onPhotoSelect,
  onContinue,
  error,
}: {
  photoPreview: string | null;
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  error: string;
}) {
  return (
    <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">Upload Your Photo</h2>
        <p className="text-sm text-surface-400 mt-1">
          Upload a full-body photo for the best avatar quality
        </p>
      </div>
      <div className="p-6">
        <label className="block cursor-pointer">
          <div
            className={`relative aspect-[3/4] max-w-xs mx-auto rounded-2xl border-2 border-dashed transition-colors overflow-hidden ${
              photoPreview ? 'border-perfit-500' : 'border-surface-700 hover:border-surface-600'
            }`}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-surface-500">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17,8 12,3 7,8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white mb-1">Click to upload</p>
                <p className="text-xs text-surface-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={onPhotoSelect} />
        </label>

        {error && (
          <p className="text-sm text-red-400 text-center mt-4">{error}</p>
        )}

        <div className="mt-6 p-4 rounded-xl bg-perfit-500/10 border border-perfit-500/20">
          <h4 className="text-sm font-medium text-perfit-400 mb-2">Tips for best results</h4>
          <ul className="text-xs text-surface-400 space-y-1">
            <li>Stand in a well-lit area</li>
            <li>Wear fitted clothing</li>
            <li>Face the camera straight on</li>
            <li>Include your full body in the frame</li>
          </ul>
        </div>

        <button
          onClick={onContinue}
          disabled={!photoPreview}
          className="w-full mt-6 py-3 px-6 rounded-xl bg-gradient-to-r from-perfit-500 to-perfit-400 text-white text-sm font-semibold shadow-lg shadow-perfit-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-perfit-500/40 transition-all"
        >
          Continue to Measurements
        </button>
      </div>
    </section>
  );
}

function MeasurementsStep({
  measurements,
  onChange,
  onBack,
  onCreate,
  error,
}: {
  measurements: Measurements;
  onChange: (key: keyof Measurements, value: number) => void;
  onBack: () => void;
  onCreate: () => void;
  error: string;
}) {
  const fields: { key: keyof Measurements; label: string; unit: string; min: number; max: number }[] = [
    { key: 'heightCm', label: 'Height', unit: 'cm', min: 100, max: 220 },
    { key: 'weightKg', label: 'Weight', unit: 'kg', min: 30, max: 200 },
    { key: 'chestCm', label: 'Chest', unit: 'cm', min: 60, max: 150 },
    { key: 'waistCm', label: 'Waist', unit: 'cm', min: 50, max: 140 },
    { key: 'hipsCm', label: 'Hips', unit: 'cm', min: 60, max: 160 },
  ];

  return (
    <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">Enter Your Measurements</h2>
        <p className="text-sm text-surface-400 mt-1">
          These help us create an accurate avatar for virtual try-ons
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {fields.map(({ key, label, unit, min, max }) => (
            <div key={key} className={key === 'heightCm' ? 'col-span-2' : ''}>
              <label className="block text-sm font-medium text-surface-400 mb-2">
                {label} ({unit})
              </label>
              <input
                type="number"
                value={measurements[key]}
                onChange={(e) => onChange(key, Number(e.target.value))}
                min={min}
                max={max}
                className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-white/5 text-white text-sm focus:outline-none focus:border-perfit-500/50"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-400 mt-4">{error}</p>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-6 rounded-xl bg-surface-800 border border-white/5 text-white text-sm font-medium hover:bg-surface-700 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onCreate}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-perfit-500 to-perfit-400 text-white text-sm font-semibold shadow-lg shadow-perfit-500/25 hover:shadow-perfit-500/40 transition-all"
          >
            Create Avatar
          </button>
        </div>
      </div>
    </section>
  );
}

function ProcessingStep() {
  return (
    <section className="bg-surface-900 rounded-2xl border border-white/5 p-12">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-perfit-500/30 border-t-perfit-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec751a" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Creating Your Avatar</h3>
        <p className="text-surface-400 max-w-sm">
          This usually takes 30-60 seconds. We're analyzing your photo and building a 3D model...
        </p>
      </div>
    </section>
  );
}

function CompleteStep({ avatar, onStartOver }: { avatar: Avatar; onStartOver: () => void }) {
  return (
    <section className="bg-surface-900 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Your Avatar</h2>
          <p className="text-sm text-surface-400 mt-0.5">Ready for virtual try-ons</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-medium">
          Active
        </span>
      </div>
      <div className="p-6">
        <div className="flex gap-8">
          <div className="w-48 aspect-[3/4] rounded-2xl overflow-hidden bg-surface-800 ring-2 ring-perfit-500/30">
            {avatar.thumbnailUrl ? (
              <img src={avatar.thumbnailUrl} alt="Your avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-surface-600">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <MeasurementBadge label="Height" value={`${avatar.measurements.heightCm} cm`} />
              <MeasurementBadge label="Weight" value={`${avatar.measurements.weightKg} kg`} />
              <MeasurementBadge label="Chest" value={`${avatar.measurements.chestCm} cm`} />
              <MeasurementBadge label="Waist" value={`${avatar.measurements.waistCm} cm`} />
              <MeasurementBadge label="Hips" value={`${avatar.measurements.hipsCm} cm`} />
            </div>

            <p className="text-xs text-surface-500">
              Created {new Date(avatar.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={onStartOver}
              className="px-4 py-2 rounded-lg bg-surface-800 border border-white/5 text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-700 transition-colors"
            >
              Create New Avatar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MeasurementBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-lg bg-surface-800/50 border border-white/5">
      <p className="text-[10px] text-surface-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

