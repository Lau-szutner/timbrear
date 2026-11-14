'use client';

import { useState, type FormEvent } from 'react';
import { registerSchema } from '@/lib/validation/registerSchema';

interface RegisterFormProps {
  onRegistered: (email: string) => void;
}

interface RegisterErrorResponse {
  error?: string;
  fields?: {
    email?: string[];
    password?: string[];
  };
}

export const RegisterForm = ({ onRegistered }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError('');

    const parsed = registerSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors({
        email: parsed.error.flatten().fieldErrors.email?.[0],
        password: parsed.error.flatten().fieldErrors.password?.[0],
      });
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({
        confirmPassword: 'Las contraseñas no coinciden.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as RegisterErrorResponse & {
        user?: { email: string };
      };

      if (response.status === 201 && result.user) {
        onRegistered(result.user.email);
        return;
      }

      if (result.error === 'email_exists') {
        setFieldErrors({ email: 'Ya existe una cuenta con ese correo.' });
      } else if (result.error === 'invalid_request' && result.fields) {
        setFieldErrors({
          email: result.fields.email?.[0],
          password: result.fields.password?.[0],
        });
      } else {
        setFormError('No se pudo crear la cuenta. Intentá de nuevo más tarde.');
      }
    } catch {
      setFormError('No se pudo conectar. Revisá tu conexión e intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="register-field">
        <label className="register-label" htmlFor="register-email">
          Correo electrónico
        </label>
        <input
          id="register-email"
          className="register-input"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
        />
        {fieldErrors.email && (
          <p className="register-field-error" id="register-email-error">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="register-field">
        <label className="register-label" htmlFor="register-password">
          Contraseña
        </label>
        <input
          id="register-password"
          className="register-input"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? 'register-password-error' : 'password-hint'
          }
        />
        <p className="register-hint" id="password-hint">
          Usá entre 8 y 128 caracteres.
        </p>
        {fieldErrors.password && (
          <p className="register-field-error" id="register-password-error">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div className="register-field">
        <label className="register-label" htmlFor="register-confirm-password">
          Repetí la contraseña
        </label>
        <input
          id="register-confirm-password"
          className="register-input"
          type="password"
          autoComplete="new-password"
          required
          maxLength={128}
          placeholder="Repetí tu contraseña"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={
            fieldErrors.confirmPassword
              ? 'register-confirm-password-error'
              : undefined
          }
        />
        {fieldErrors.confirmPassword && (
          <p
            className="register-field-error"
            id="register-confirm-password-error"
          >
            {fieldErrors.confirmPassword}
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
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  );
};
