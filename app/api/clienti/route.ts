import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email mancante' }, { status: 400 });
  }

  const cliente = await db.cliente.findUnique({
    where: { email },
  });

  if (!cliente) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(cliente);
}
