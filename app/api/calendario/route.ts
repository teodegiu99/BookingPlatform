// app/api/calendario/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const commerciali = await db.user.findMany({
    where: {
      role: {
        not: 'ADMIN',
      },
      mostracommerciale: {
        not: false,
      }
    },
    select: {
      id: true,
      name: true,
      cognome: true,
      societa: true,
      image: true,
      color: true,
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
