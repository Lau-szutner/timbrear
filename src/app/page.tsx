import Link from 'next/link';

const demoUrl = '/t/demo1234abcd';
const qrCells = new Set([
  0, 1, 2, 5, 6, 7, 9, 11, 12, 14, 16, 17, 18, 20, 21, 22, 24, 25, 27, 28,
  29, 31, 33, 35, 36, 37, 39, 40, 42, 43, 45, 47, 48,
]);

const steps = [
  [
    '01',
    'Pegás el QR',
    'Colocá el código en la puerta o en el lugar donde suelen llegar tus visitas.',
  ],
  [
    '02',
    'Lo escanean',
    'La persona elige si viene de visita o trae un paquete y puede dejar un mensaje.',
  ],
  [
    '03',
    'Recibís el aviso',
    'La idea es que te enteres a tiempo para responder. Las notificaciones están en desarrollo.',
  ],
];

export default function Home() {
  return (
    <main className="page-shell overflow-hidden">
      <header className="site-header lg:px-8">
        <Link
          href="/"
          className="brand-link"
          aria-label="TimbreAR, inicio"
        >
          <span className="brand-mark">T</span>
          <span className="brand-name">TimbreAR</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/registro"
            className="header-action hover:border-pine hover:bg-white"
          >
            Crear cuenta
          </Link>
          <Link
            href={demoUrl}
            className="header-action hover:border-pine hover:bg-white"
          >
            Probar demo
          </Link>
        </nav>
      </header>

      <section className="landing-hero md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-20 lg:px-8">
        <div>
          <p className="hero-eyebrow">
            <span className="size-2 rounded-full bg-sage" />
            Una forma simple de recibir visitas y entregas
          </p>
          <h1 className="hero-title sm:text-6xl">
            Si no funciona el timbre, que funcione un{' '}
            <span className="text-sage">QR.</span>
          </h1>
          <p className="hero-description">
            Pegá un código en la entrada de tu edificio. Quien llegue lo escanea,
            avisa si es una visita o trae un paquete, y vos sabés que te están
            esperando.
          </p>
          <div className="hero-actions">
            <Link
              href={demoUrl}
              className="button-primary hover:bg-pine-hover"
            >
              Probar la demo
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
            <a
              href="#como-funciona"
              className="button-secondary hover:bg-white"
            >
              ¿Cómo funciona?
            </a>
          </div>
          <p className="demo-note">
            La demo simula el aviso; todavía no envía notificaciones reales.
          </p>
        </div>

        <div className="preview-frame">
          <div className="preview-backdrop" />
          <div className="preview-card">
            <div className="preview-heading">
              <span className="text-sm font-medium text-text-soft">
                TIMBRE DIGITAL
              </span>
              <span className="pill px-3 py-1 text-xs">DEMO</span>
            </div>
            <div className="my-8 flex justify-center">
              <div className="qr-grid">
                {Array.from({ length: 49 }, (_, index) => (
                  <span
                    key={index}
                    className={`qr-cell ${
                      qrCells.has(index) ? 'qr-cell-filled' : 'qr-cell-empty'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">¿Llegaste al edificio?</p>
              <p className="mt-1 text-sm text-text-soft">
                Escaneá el QR y dejanos un aviso
              </p>
            </div>
            <div className="preview-actions">
              <div className="preview-action">Soy una visita</div>
              <div className="preview-action">Traigo un paquete</div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="steps-section">
        <div className="section-container lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="text-eyebrow">Así de fácil</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Un aviso en tres pasos
            </h2>
          </div>
          <div className="steps-grid">
            {steps.map(([number, title, description]) => (
              <article key={number} className="step-card">
                <span className="text-sm font-semibold text-sage">{number}</span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-text-muted">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href={demoUrl}
              className="demo-text-link hover:text-pine"
            >
              Entrar a la demo →
            </Link>
          </div>
        </div>
      </section>

      <footer className="site-footer sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span className="font-medium text-text-muted">TimbreAR</span>
        <span>Un prototipo para que tus entregas no queden esperando.</span>
      </footer>
    </main>
  );
}
