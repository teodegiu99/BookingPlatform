// app/api/calendario/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const commerciali = await db.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  const appuntamenti = await db.appuntamento.findMany({
    include: {
      cliente: true,
      commerciale: true,
    },
  });

  return NextResponse.json({ commerciali, appuntamenti });
}
