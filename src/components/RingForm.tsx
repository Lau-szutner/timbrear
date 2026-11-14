'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export interface RingFormProps {
  token: string;
  isDemo: boolean;
}

export const RingForm = ({ token, isDemo }: RingFormProps) => {
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
      <div role="status" className="ring-success">
        <span className="ring-success-icon">✓</span>
        <p className="ring-success-title">
          {isDemo ? '¡La prueba funcionó!' : '¡Listo! Ya avisamos.'}
        </p>
        <p className="ring-success-message">
          {isDemo
            ? 'Este aviso es simulado; no se envió ninguna notificación.'
            : 'Esperá un momento para que el residente reciba tu aviso.'}
        </p>
      </div>
    );
  }

  const disabled = status === 'sending';

  return (
    <div className="ring-form">
      <button
        onClick={() => ring('visit')}
        disabled={disabled}
        className="ring-button-primary hover:bg-pine-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
      >
        {disabled ? 'Enviando aviso…' : 'Soy una visita'}
      </button>
      <button
        onClick={() => ring('package')}
        disabled={disabled}
        className="ring-button-secondary hover:border-pine hover:bg-card-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
      >
        Traigo un paquete
      </button>
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={280}
        placeholder="Mensaje opcional (ej: soy Juan)"
        disabled={disabled}
        className="ring-message-input"
      />
      {status === 'error' && (
        <p role="alert" className="ring-error">
          No se pudo enviar el aviso. Revisá tu conexión e intentá de nuevo.
        </p>
      )}
    </div>
  );
};
