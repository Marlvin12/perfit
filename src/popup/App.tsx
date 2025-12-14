import { useEffect, useState } from 'react';
import { sendMessage } from '@/shared/messaging';
import type { AuthState, TryOnResult } from '@/shared/types';
import { Header } from './components/Header';
import { AvatarCard } from './components/AvatarCard';
import { QuickActions } from './components/QuickActions';
import { RecentTryOns } from './components/RecentTryOns';
import { LoginPrompt } from './components/LoginPrompt';
import { storage } from '@/shared/storage';

export function App() {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [recentTryOns, setRecentTryOns] = useState<TryOnResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [authResponse, history] = await Promise.all([
      sendMessage<void, AuthState>('GET_AUTH_STATE'),
      storage.getTryOnHistory(),
    ]);

    if (authResponse.success && authResponse.data) {
      setAuthState(authResponse.data);
    }
    setRecentTryOns(history.slice(0, 4));
    setLoading(false);
  }

  function openOptions(path = '') {
    chrome.runtime.openOptionsPage();
    if (path) {
      chrome.tabs.create({ url: chrome.runtime.getURL(`src/options/index.html${path}`) });
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!authState?.isAuthenticated) {
    return (
      <div className="min-h-[480px] flex flex-col">
        <Header />
        <LoginPrompt onLogin={() => openOptions('?login=true')} />
      </div>
    );
  }

  return (
    <div className="min-h-[480px] flex flex-col">
      <Header user={authState.user} />

      <div className="flex-1 p-4 space-y-4">
        <AvatarCard
          avatar={authState.avatar}
          onCreateAvatar={() => openOptions('?create-avatar=true')}
          onEditAvatar={() => openOptions('?edit-avatar=true')}
        />

        <QuickActions
          hasAvatar={!!authState.avatar}
          onSettings={() => openOptions()}
          onHelp={() => chrome.tabs.create({ url: 'https://perfit.ai/help' })}
        />

        {recentTryOns.length > 0 && <RecentTryOns tryOns={recentTryOns} />}
      </div>

      <Footer />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-[480px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-3 border-perfit-500/30 border-t-perfit-500 animate-spin" />
        <span className="text-sm text-surface-400">Loading...</span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="px-4 py-3 border-t border-white/5 text-center">
      <span className="text-xs text-surface-500">
        PerFit v0.1.0 - AI Virtual Fitting Room
      </span>
    </div>
  );
}

