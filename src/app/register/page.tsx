import { RegistrationPanel } from '@/components/RegistrationPanel';
import { Logo } from '@/components/Logo';

export default function RegisterPage() {
  return (
    <main className="page-shell">
      <header className="site-header lg:px-8">
        <Logo />
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
