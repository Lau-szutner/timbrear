import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation/registerSchema';
import { registerUser } from '@/server/services/userService.js';
import {
  assertAuthConfigured,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/server/security/session.js';

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
    assertAuthConfigured();
    const user = await registerUser(parsed.data);

    if (!user) {
      return NextResponse.json(
        { error: 'email_exists' },
        { status: 409 },
      );
    }

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
