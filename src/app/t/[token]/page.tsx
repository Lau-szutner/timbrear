import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  DEMO_TOKEN,
  findActiveDoorbellByToken,
} from '@/server/services/ringService.js';
import { RingForm } from '@/components/RingForm';

export default function DoorbellPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <main className="page-shell">
      <header className="site-header lg:px-8">
        <Link
          href="/"
          className="brand-link"
          aria-label="TimbreAR, inicio"
        >
          <span className="brand-mark">T</span>
          <span className="brand-name">TimbreAR</span>
        </Link>
      </header>

      <Suspense fallback={<DoorbellLoading />}>
        <DoorbellContent params={params} />
      </Suspense>
    </main>
  );
}

async function DoorbellContent({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const doorbell = await findActiveDoorbellByToken(token);

  if (!doorbell) notFound();

  return (
      <section className="doorbell-section md:pb-24 md:pt-14">
        <div className="doorbell-card-wrap">
          <div className="doorbell-card-backdrop" />
          <div className="doorbell-card sm:p-10">
            <header className="text-center">
              {token === DEMO_TOKEN && (
                <span className="pill mb-4 inline-flex">
                  DEMO
                </span>
              )}
              <p className="text-eyebrow">
                Timbre digital
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                ¿Llegaste al edificio?
              </h1>
              <p className="mt-3 text-lg content-muted">
                Estás tocando el timbre de
              </p>
              <p className="mt-1 text-xl font-semibold text-pine">
                {doorbell.label}
              </p>
              <p className="mt-3 text-sm leading-6 content-soft">
                Elegí una opción para avisar que estás acá.
              </p>
            </header>

            <div className="mt-8">
              <RingForm token={token} isDemo={token === DEMO_TOKEN} />
            </div>
          </div>
          <p className="relative mt-8 text-center text-sm content-soft">
            Un servicio de{' '}
            <Link
              href="/"
              className="font-semibold text-sage-dark hover:text-pine"
            >
              TimbreAR
            </Link>
          </p>
        </div>
      </section>
  );
}

function DoorbellLoading() {
  return (
    <section
      aria-label="Cargando timbre"
      className="loading-section md:pb-24 md:pt-14"
    >
      <div className="doorbell-card-wrap self-center">
        <div className="doorbell-card-backdrop" />
        <div className="loading-card">
          <span className="mx-auto block size-3 animate-pulse rounded-full bg-sage" />
          <p className="mt-4 text-sm font-medium content-muted">
            Cargando timbre…
          </p>
        </div>
      </div>
    </section>
  );
}
