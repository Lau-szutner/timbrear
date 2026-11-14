import { NextResponse } from 'next/server';
import sequelize from '@/server/config/database.js';

export async function GET() {
  try {
    await sequelize.authenticate();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
