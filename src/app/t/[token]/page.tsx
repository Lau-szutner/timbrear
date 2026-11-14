import { notFound } from 'next/navigation';
import {
  DEMO_TOKEN,
  findActiveDoorbellByToken,
} from '@/server/services/ringService.js';
import RingForm from './RingForm';

export default async function DoorbellPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const doorbell = await findActiveDoorbellByToken(token);

  if (!doorbell) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 p-6">
      <header className="text-center">
        <p className="text-sm text-neutral-500">Estás tocando el timbre de</p>
        <h1 className="text-3xl font-bold">{doorbell.label}</h1>
      </header>
      <RingForm token={token} isDemo={token === DEMO_TOKEN} />
    </main>
  );
}
