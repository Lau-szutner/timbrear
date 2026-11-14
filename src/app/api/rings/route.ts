import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createRing } from '@/server/services/ringService.js';

const bodySchema = z.object({
  token: z.string().min(8).max(32),
  type: z.enum(['visit', 'package']),
  message: z.string().trim().max(280).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const ring = await createRing({
      ...parsed.data,
      message: parsed.data.message,
    });

    if (!ring) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json(
      { id: ring.id, status: ring.status },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
