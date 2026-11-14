'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthModeSwitch } from '@/components/AuthModeSwitch';
import { RegisterForm } from '@/components/RegisterForm';

export const RegistrationPanel = () => {
  const [registeredEmail, setRegisteredEmail] = useState('');

  if (registeredEmail) {
    return (
      <div className="register-success" role="status">
        <span className="ring-success-icon">✓</span>
        <h1 className="register-title">Cuenta creada</h1>
        <p className="ring-success-message">
          Registramos <strong>{registeredEmail}</strong>. Ya podés iniciar
          sesión; la creación de timbres todavía está en desarrollo.
        </p>
        <Link
          href="/login"
          className="button-primary register-submit hover:bg-pine-hover"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <AuthModeSwitch mode="register" />
      <p className="text-eyebrow">Empezá con TimbreAR</p>
      <h1 className="register-title">Creá tu cuenta</h1>
      <p className="register-description">
        Registrá tus datos para empezar. Todavía no podés configurar un
        departamento desde la aplicación.
      </p>
      <div className="mt-8 ">
        <RegisterForm onRegistered={setRegisteredEmail} />
      </div>
    </>
  );
};
