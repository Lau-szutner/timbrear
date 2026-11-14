import { LoginPanel } from '@/components/LoginPanel';
import { Logo } from '@/components/Logo';
export default function LoginPage() {
  return (
    <main className="page-shell">
      <header className="site-header lg:px-8">
        <Logo />
      </header>

      <section className="register-section">
        <div className="doorbell-card-wrap">
          <div className="doorbell-card-backdrop" />
          <div className="doorbell-card sm:p-10">
            <LoginPanel />
          </div>
        </div>
      </section>
    </main>
  );
}
