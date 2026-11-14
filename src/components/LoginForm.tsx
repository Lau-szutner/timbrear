'use client';

import { useState, type SubmitEvent } from 'react';
import { loginSchema } from '@/lib/validation/loginSchema';

interface LoginFormProps {
  onLoggedIn: (email: string) => void;
}

interface LoginResponse {
  error?: string;
  fields?: {
    email?: string[];
    password?: string[];
  };
  user?: {
    email: string;
  };
}

export const LoginForm = ({ onLoggedIn }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError('');

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      setFieldErrors({
        email: parsed.error.flatten().fieldErrors.email?.[0],
        password: parsed.error.flatten().fieldErrors.password?.[0],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as LoginResponse;

      if (response.ok && result.user) {
        onLoggedIn(result.user.email);
        return;
      }

      if (result.error === 'invalid_credentials') {
        setFormError('El correo o la contraseña no son correctos.');
      } else if (result.error === 'invalid_request' && result.fields) {
        setFieldErrors({
          email: result.fields.email?.[0],
          password: result.fields.password?.[0],
        });
      } else {
        setFormError('No se pudo iniciar sesión. Intentá de nuevo más tarde.');
      }
    } catch {
      setFormError(
        'No se pudo conectar. Revisá tu conexión e intentá de nuevo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="register-field">
        <label className="register-label" htmlFor="login-email">
          Correo electrónico
        </label>
        <input
          id="login-email"
          className="register-input"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
        />
        {fieldErrors.email && (
          <p className="register-field-error" id="login-email-error">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="register-field">
        <label className="register-label" htmlFor="login-password">
          Contraseña
        </label>
        <input
          id="login-password"
          className="register-input"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
          placeholder="Tu contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? 'login-password-error' : undefined
          }
        />
        {fieldErrors.password && (
          <p className="register-field-error" id="login-password-error">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {formError && (
        <p className="register-error" role="alert">
          {formError}
        </p>
      )}

      <button
        className="button-primary register-submit hover:bg-pine-hover disabled:cursor-wait disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </button>
    </form>
  );
};
