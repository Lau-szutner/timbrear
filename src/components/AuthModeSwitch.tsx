import Link from 'next/link';

export interface AuthModeSwitchProps {
  mode: 'login' | 'register';
}

export const AuthModeSwitch = ({ mode }: AuthModeSwitchProps) => (
  <nav className="auth-mode-switch" aria-label="Acceso a la cuenta">
    <Link
      href="/login"
      aria-current={mode === 'login' ? 'page' : undefined}
      className={`auth-mode-option ${
        mode === 'login' ? 'auth-mode-option-active' : ''
      }`}
    >
      Iniciar sesión
    </Link>
    <Link
      href="/register"
      aria-current={mode === 'register' ? 'page' : undefined}
      className={`auth-mode-option ${
        mode === 'register' ? 'auth-mode-option-active' : ''
      }`}
    >
      Crear cuenta
    </Link>
  </nav>
);
