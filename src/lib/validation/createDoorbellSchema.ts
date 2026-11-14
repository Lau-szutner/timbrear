import { z } from 'zod';

export const createDoorbellSchema = z
  .object({
    label: z
      .string()
      .trim()
      .min(1, 'Ingresá un nombre para el timbre.')
      .max(100, 'El nombre no puede superar los 100 caracteres.'),
  })
  .strict();

export type CreateDoorbellInput = z.infer<typeof createDoorbellSchema>;
