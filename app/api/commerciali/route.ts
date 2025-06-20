import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const commerciali = await db.user.findMany({
    where: { role: { in: ['USER', 'SUSER'] } }, // o come hai definito i commerciali
    select: { id: true, name: true, cognome: true, email: true },
  });
  return NextResponse.json(commerciali);
}