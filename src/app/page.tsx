import Link from 'next/link';

const demoUrl = '/t/demo1234abcd';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#20231f]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="TimbreAR, inicio">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#233b32] text-lg font-bold text-white">
            T
          </span>
          <span className="text-xl font-semibold tracking-tight">TimbreAR</span>
        </Link>
        <Link
          href={demoUrl}
          className="rounded-full border border-[#d8d9d2] px-5 py-2.5 text-sm font-semibold transition hover:border-[#233b32] hover:bg-white"
        >
          Probar demo
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-12 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-20 lg:px-8">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e8eee8] px-4 py-2 text-sm font-medium text-[#385545]">
            <span className="size-2 rounded-full bg-[#578365]" />
            Una forma simple de recibir visitas y entregas
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Si no funciona el timbre, que funcione un{' '}
            <span className="text-[#578365]">QR.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#62665f]">
            Pegá un código en la entrada de tu edificio. Quien llegue lo escanea,
            avisa si es una visita o trae un paquete, y vos sabés que te están
            esperando.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={demoUrl}
              className="inline-flex items-center justify-center rounded-full bg-[#233b32] px-7 py-3.5 font-semibold text-white transition hover:bg-[#304d40]"
            >
              Probar la demo
              <span className="ml-2" aria-hidden="true">→</span>
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border border-[#d8d9d2] px-7 py-3.5 font-semibold transition hover:bg-white"
            >
              ¿Cómo funciona?
            </a>
          </div>
          <p className="mt-4 text-sm text-[#777a73]">
            La demo simula el aviso; todavía no envía notificaciones reales.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-[#e8eee8]" />
          <div className="relative rounded-[2rem] border border-[#e7e5dd] bg-white p-7 shadow-xl shadow-[#233b32]/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#777a73]">TIMBRE DIGITAL</span>
              <span className="rounded-full bg-[#e8eee8] px-3 py-1 text-xs font-semibold text-[#385545]">
                DEMO
              </span>
            </div>
            <div className="my-8 flex justify-center">
              <div className="grid size-48 grid-cols-7 grid-rows-7 gap-1 rounded-xl bg-white p-3">
                {[...Array(49)].map((_, index) => (
                  <span
                    key={index}
                    className={`rounded-[2px] ${
                      [0, 1, 2, 5, 6, 7, 9, 11, 12, 14, 16, 17, 18, 20, 21, 22, 24, 25, 27, 28, 29, 31, 33, 35, 36, 37, 39, 40, 42, 43, 45, 47, 48].includes(index)
                        ? 'bg-[#233b32]'
                        : 'bg-[#f0f1ec]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">¿Llegaste al edificio?</p>
              <p className="mt-1 text-sm text-[#777a73]">
                Escaneá el QR y dejanos un aviso
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f5f6f2] px-3 py-3 text-center text-sm font-medium">
                Soy una visita
              </div>
              <div className="rounded-xl bg-[#f5f6f2] px-3 py-3 text-center text-sm font-medium">
                Traigo un paquete
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-[#ecebe5] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#578365]">
              Así de fácil
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Un aviso en tres pasos
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ['01', 'Pegás el QR', 'Colocá el código en la puerta o en el lugar donde suelen llegar tus visitas.'],
              ['02', 'Lo escanean', 'La persona elige si viene de visita o trae un paquete y puede dejar un mensaje.'],
              ['03', 'Recibís el aviso', 'La idea es que te enteres a tiempo para responder. Las notificaciones están en desarrollo.'],
            ].map(([number, title, description]) => (
              <article key={number} className="rounded-2xl bg-[#faf9f6] p-6">
                <span className="text-sm font-semibold text-[#578365]">{number}</span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-[#62665f]">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href={demoUrl}
              className="font-semibold text-[#385545] underline decoration-[#a9bcae] underline-offset-4 hover:text-[#233b32]"
            >
              Entrar a la demo →
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-[#777a73] sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span className="font-medium text-[#62665f]">TimbreAR</span>
        <span>Un prototipo para que tus entregas no queden esperando.</span>
      </footer>
    </main>
  );
}
