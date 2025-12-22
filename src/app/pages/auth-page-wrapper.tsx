import { useState } from 'react';
import { AuthPage } from '../components/auth-page';
import ChangePasswordPage from '../components/change-password';

interface AuthPageWrapperProps {
  onLogin: (email: string, password: string, name?: string) => void;
  setTokens: (tokens: { access_token: string; refresh_token: string }) => void;
}

export function AuthPageWrapper({ onLogin, setTokens }: AuthPageWrapperProps) {
  const [authScreen, setAuthScreen] = useState<'auth' | 'changePassword'>('auth');

  if (authScreen === 'changePassword') {
    return <ChangePasswordPage onBack={() => setAuthScreen('auth')} />;
  }

  return (
    <AuthPage
      onLogin={onLogin}
      onChangePassword={() => setAuthScreen('changePassword')}
      setTokens={setTokens}
    />
  );
}
