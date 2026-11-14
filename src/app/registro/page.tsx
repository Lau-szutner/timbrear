import Link from 'next/link';
import { RegistrationPanel } from '@/components/RegistrationPanel';

export default function RegisterPage() {
  return (
    <main className="page-shell">
      <header className="site-header lg:px-8">
        <Link href="/" className="brand-link" aria-label="TimbreAR, inicio">
          <span className="brand-mark">T</span>
          <span className="brand-name">TimbreAR</span>
        </Link>
      </header>

      <section className="register-section">
        <div className="doorbell-card-wrap">
          <div className="doorbell-card-backdrop" />
          <div className="doorbell-card sm:p-10">
            <RegistrationPanel />
          </div>
        </div>
      </section>
    </main>
  );
}
