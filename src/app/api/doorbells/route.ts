import { NextResponse } from 'next/server';
import { createDoorbellSchema } from '@/lib/validation/createDoorbellSchema';
import { getSession } from '@/server/security/session.js';
import { createDoorbellForUser } from '@/server/services/doorbellService.js';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createDoorbellSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'invalid_request',
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const doorbell = await createDoorbellForUser({
      userId: session.userId,
      label: parsed.data.label,
    });

    return NextResponse.json({ doorbell }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
