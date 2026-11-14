import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation/registerSchema';
import { registerUser } from '@/server/services/userService.js';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

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
    const user = await registerUser(parsed.data);

    if (!user) {
      return NextResponse.json(
        { error: 'email_exists' },
        { status: 409 },
      );
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
