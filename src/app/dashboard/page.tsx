import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { toDataURL } from 'qrcode';
import { CreateDoorbellForm } from '@/components/CreateDoorbellForm';
import { Logo } from '@/components/Logo';
import { getSession } from '@/server/security/session.js';
import { getUserDashboard } from '@/server/services/userService.js';

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();

  const session = await getSession();
  if (!session) redirect('/login');

  const dashboard = await getUserDashboard(session.userId);
  if (!dashboard) redirect('/login');

  const appUrl =
    process.env.APP_URL ??
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null);
  if (!appUrl) {
    throw new Error('APP_URL must be configured to generate doorbell QR codes.');
  }

  const parsedAppUrl = new URL(appUrl);
  if (
    (parsedAppUrl.protocol !== 'http:' && parsedAppUrl.protocol !== 'https:') ||
    (process.env.NODE_ENV === 'production' && parsedAppUrl.protocol !== 'https:')
  ) {
    throw new Error('APP_URL must use HTTP or HTTPS, and HTTPS in production.');
  }

  const appOrigin = parsedAppUrl.origin;
  const doorbells = await Promise.all(
    dashboard.doorbells.map(async (doorbell) => ({
      ...doorbell,
      url: `${appOrigin}/t/${doorbell.token}`,
      qrCode: await toDataURL(`${appOrigin}/t/${doorbell.token}`, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 240,
      }),
    })),
  );

  return (
    <main className="page-shell">
      <header className="site-header lg:px-8">
        <Link href="/" className="brand-link">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-text-muted sm:inline">
            {dashboard.user.email}
          </span>
          <form action="/api/auth/logout" method="post">
            <button
              className="header-action hover:border-sage hover:text-sage-dark"
              type="submit"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <p className="text-eyebrow">Tu cuenta</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Mi panel
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-text-muted">
          Administrá tus timbres y consultá la información asociada a tu cuenta.
        </p>
        <CreateDoorbellForm />

        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
          <section className="rounded-3xl border border-card-stroke bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-pine">
                  Mis timbres
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                  {doorbells.length === 1
                    ? '1 timbre asociado a tu cuenta'
                    : `${doorbells.length} timbres asociados a tu cuenta`}
                </p>
              </div>
            </div>

            {doorbells.length > 0 ? (
              <ul className="mt-6 grid gap-4">
                {doorbells.map((doorbell) => (
                  <li
                    key={doorbell.id}
                    className="flex flex-col gap-5 rounded-2xl border border-card-stroke bg-page p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <Image
                        src={doorbell.qrCode}
                        alt={`Código QR para ${doorbell.label}`}
                        width={120}
                        height={120}
                        unoptimized
                        className="size-24 rounded-xl border border-card-stroke bg-white p-2"
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-pine">
                          {doorbell.label}
                        </h3>
                        <p className="mt-1 text-sm text-text-muted">
                          Timbre {doorbell.active ? 'activo' : 'inactivo'}
                        </p>
                        <a
                          className="mt-2 block break-all text-sm text-sage-dark underline underline-offset-2"
                          href={doorbell.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {doorbell.url}
                        </a>
                      </div>
                    </div>
                    <Link
                      className="button-secondary shrink-0 px-5 py-2.5 text-sm hover:border-sage hover:text-sage-dark"
                      href={`/t/${doorbell.token}`}
                    >
                      Probar timbre
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-sage-line bg-card-muted p-6">
                <h3 className="font-semibold text-pine">
                  Todavía no tenés timbres
                </h3>
                <p className="mt-2 max-w-xl leading-6 text-text-muted">
                  Cuando asocies un timbre a tu cuenta, aparecerá acá para que
                  puedas compartir su página con tus visitas.
                </p>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-3xl border border-card-stroke bg-white p-6 shadow-sm sm:p-8">
            <p className="text-eyebrow">Tu perfil</p>
            <h2 className="mt-3 text-xl font-semibold text-pine">
              Cuenta de TimbreAR
            </h2>
            <p className="mt-4 break-all text-text-muted">
              {dashboard.user.email}
            </p>
            <p className="mt-4 text-sm leading-6 text-text-soft">
              Tu sesión está protegida y se mantiene iniciada durante siete
              días en este dispositivo.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

function DashboardLoading() {
  return (
    <main className="page-shell">
      <header className="site-header lg:px-8">
        <Link href="/" className="brand-link">
          <Logo />
        </Link>
      </header>
      <section
        aria-label="Cargando panel"
        className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-6"
      >
        <div className="rounded-3xl border border-card-stroke bg-white px-8 py-10 text-center shadow-sm">
          <span className="mx-auto block size-3 animate-pulse rounded-full bg-sage" />
          <p className="mt-4 text-sm font-medium text-text-muted">
            Cargando tu panel…
          </p>
        </div>
      </section>
    </main>
  );
}
