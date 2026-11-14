'use client';

import { AuthModeSwitch } from '@/components/AuthModeSwitch';
import { LoginForm } from '@/components/LoginForm';

export const LoginPanel = () => {
  return (
    <>
      <AuthModeSwitch mode="login" />
      <p className="text-eyebrow">Qué bueno verte de nuevo</p>
      <h1 className="register-title">Iniciá sesión</h1>
      <p className="register-description">
        Ingresá con el correo y la contraseña de tu cuenta.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </>
  );
};
