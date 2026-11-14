'use client';

import { AuthModeSwitch } from '@/components/AuthModeSwitch';
import { RegisterForm } from '@/components/RegisterForm';

export const RegistrationPanel = () => {
  return (
    <>
      <AuthModeSwitch mode="register" />
      <p className="text-eyebrow">Empezá con TimbreAR</p>
      <h1 className="register-title">Creá tu cuenta</h1>
      <p className="register-description">
        Registrá tus datos para crear tu cuenta y acceder a tu panel.
      </p>
      <div className="mt-8 ">
        <RegisterForm />
      </div>
    </>
  );
};
