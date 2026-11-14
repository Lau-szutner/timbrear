'use client';

import { useState } from 'react';
import { AuthModeSwitch } from '@/components/AuthModeSwitch';
import { LoginForm } from '@/components/LoginForm';

export const LoginPanel = () => {
  const [loggedInEmail, setLoggedInEmail] = useState('');

  if (loggedInEmail) {
    return (
      <div className="register-success" role="status">
        <span className="ring-success-icon">✓</span>
        <h1 className="register-title">Sesión iniciada</h1>
        <p className="ring-success-message">
          Entraste como <strong>{loggedInEmail}</strong>. La administración de
          departamentos todavía está en desarrollo.
        </p>
      </div>
    );
  }

  return (
    <>
      <AuthModeSwitch mode="login" />
      <p className="text-eyebrow">Qué bueno verte de nuevo</p>
      <h1 className="register-title">Iniciá sesión</h1>
      <p className="register-description">
        Ingresá con el correo y la contraseña de tu cuenta.
      </p>
      <div className="mt-8">
        <LoginForm onLoggedIn={setLoggedInEmail} />
      </div>
    </>
  );
};
