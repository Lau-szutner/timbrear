'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function RingForm({
  token,
  isDemo,
}: {
  token: string;
  isDemo: boolean;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function ring(type: 'visit' | 'package') {
    setStatus('sending');
    try {
      const res = await fetch('/api/rings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, type, message: message || undefined }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <p className="rounded-2xl bg-green-100 p-6 text-center text-lg text-green-900">
        {isDemo
          ? '¡La prueba funcionó! Este aviso es simulado; no se envió ninguna notificación.'
          : '¡Listo! Ya avisamos. Esperá un momento.'}
      </p>
    );
  }

  const disabled = status === 'sending';

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => ring('visit')}
        disabled={disabled}
        className="rounded-2xl bg-black py-5 text-lg font-semibold text-white disabled:opacity-50"
      >
        Soy una visita
      </button>
      <button
        onClick={() => ring('package')}
        disabled={disabled}
        className="rounded-2xl border-2 border-black py-5 text-lg font-semibold disabled:opacity-50"
      >
        Traigo un paquete
      </button>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={280}
        placeholder="Mensaje opcional (ej: soy Juan)"
        className="rounded-xl border p-3"
      />
      {status === 'error' && (
        <p className="text-center text-red-600">
          No se pudo avisar. Probá de nuevo.
        </p>
      )}
    </div>
  );
}
