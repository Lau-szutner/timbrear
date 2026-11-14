'use client';

import { useRouter } from 'next/navigation';
import { useState, type SubmitEvent } from 'react';
import { createDoorbellSchema } from '@/lib/validation/createDoorbellSchema';

interface CreateDoorbellResponse {
  error?: string;
  fields?: {
    label?: string[];
  };
  doorbell?: {
    id: number;
  };
}

export function CreateDoorbellForm() {
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError('');
    setFormError('');

    const parsed = createDoorbellSchema.safeParse({ label });
    if (!parsed.success) {
      setFieldError(parsed.error.flatten().fieldErrors.label?.[0] ?? '');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/doorbells', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as CreateDoorbellResponse;

      if (response.status === 201 && result.doorbell) {
        setLabel('');
        router.refresh();
        return;
      }

      if (response.status === 401) {
        router.replace('/login');
        return;
      }

      if (result.error === 'invalid_request') {
        setFieldError(
          result.fields?.label?.[0] ?? 'Revisá el nombre del timbre.',
        );
      } else {
        setFormError('No se pudo crear el timbre. Intentá de nuevo más tarde.');
      }
    } catch {
      setFormError('No se pudo conectar. Revisá tu conexión e intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="mt-8 rounded-3xl border border-card-stroke bg-card-muted p-5 sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="register-label" htmlFor="doorbell-label">
        Agregar un timbre
      </label>
      <p className="mt-1 text-sm leading-6 text-text-muted">
        Elegí un nombre para identificar el departamento o la entrada.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="doorbell-label"
          className="register-input bg-white"
          type="text"
          autoComplete="off"
          maxLength={100}
          placeholder="Ej.: Departamento 4B"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? 'doorbell-label-error' : undefined}
        />
        <button
          className="button-primary shrink-0 hover:bg-pine-hover disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando…' : 'Crear timbre'}
        </button>
      </div>
      {fieldError && (
        <p className="register-field-error mt-2" id="doorbell-label-error">
          {fieldError}
        </p>
      )}
      {formError && (
        <p className="register-error mt-3" role="alert">
          {formError}
        </p>
      )}
    </form>
  );
}
