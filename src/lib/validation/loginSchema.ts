import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email('Ingresá un correo electrónico válido.')
      .max(254, 'El correo no puede superar los 254 caracteres.')
      .transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(1, 'Ingresá tu contraseña.')
      .max(128, 'La contraseña no es válida.'),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
