import { useEffect, useState } from 'react';
import { sendMessage } from '@/shared/messaging';
import type { AuthState } from '@/shared/types';
import { Sidebar } from './components/Sidebar';
import { ProfilePage } from './pages/ProfilePage';
import { AvatarPage } from './pages/AvatarPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AuthPage } from './pages/AuthPage';

type Page = 'profile' | 'avatar' | 'privacy' | 'auth';

export function App() {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
    handleUrlParams();
  }, []);

  async function loadAuthState() {
    const response = await sendMessage<void, AuthState>('GET_AUTH_STATE');
    if (response.success && response.data) {
      setAuthState(response.data);
      if (!response.data.isAuthenticated) {
        setCurrentPage('auth');
      }
    }
    setLoading(false);
  }

  function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true' || params.get('welcome') === 'true') {
      setCurrentPage('auth');
    } else if (params.get('create-avatar') === 'true' || params.get('edit-avatar') === 'true') {
      setCurrentPage('avatar');
    }
  }

  function handleAuthSuccess(newAuthState: AuthState) {
    setAuthState(newAuthState);
    setCurrentPage(newAuthState.avatar ? 'profile' : 'avatar');
  }

  function handleAvatarCreated(newAuthState: AuthState) {
    setAuthState(newAuthState);
    setCurrentPage('profile');
  }

  async function handleLogout() {
    await sendMessage('LOGOUT');
    setAuthState({ isAuthenticated: false, user: null, avatar: null });
    setCurrentPage('auth');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-perfit-500/30 border-t-perfit-500 animate-spin" />
      </div>
    );
  }

  if (!authState?.isAuthenticated || currentPage === 'auth') {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={authState.user}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {currentPage === 'profile' && <ProfilePage authState={authState} />}
          {currentPage === 'avatar' && (
            <AvatarPage authState={authState} onAvatarCreated={handleAvatarCreated} />
          )}
          {currentPage === 'privacy' && <PrivacyPage />}
        </div>
      </main>
    </div>
  );
}

