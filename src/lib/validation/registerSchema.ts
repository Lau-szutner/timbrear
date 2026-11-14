import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email('Ingresá un correo electrónico válido.')
      .max(254, 'El correo no puede superar los 254 caracteres.')
      .transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .max(128, 'La contraseña no puede superar los 128 caracteres.'),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
