'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RegisterForm } from '@/components/RegisterForm';

export const RegistrationPanel = () => {
  const [registeredEmail, setRegisteredEmail] = useState('');

  if (registeredEmail) {
    return (
      <div className="register-success" role="status">
        <span className="ring-success-icon">✓</span>
        <h1 className="register-title">Cuenta creada</h1>
        <p className="ring-success-message">
          Registramos <strong>{registeredEmail}</strong>. El inicio de sesión y
          la creación de timbres todavía están en desarrollo.
        </p>
        <Link
          href="/"
          className="button-primary register-submit hover:bg-pine-hover"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-eyebrow">Empezá con TimbreAR</p>
      <h1 className="register-title">Creá tu cuenta</h1>
      <p className="register-description">
        Registrá tus datos para empezar. Por ahora, esta versión crea la cuenta;
        iniciar sesión y configurar un departamento aún no está disponible.
      </p>
      <div className="mt-8">
        <RegisterForm onRegistered={setRegisteredEmail} />
      </div>
      <p className="register-back-link">
        <Link href="/" className="text-link hover:text-pine">
          Volver a TimbreAR
        </Link>
      </p>
    </>
  );
};
