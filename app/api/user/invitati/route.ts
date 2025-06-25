import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ids: string[] = body.ids;

  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: 'Formato non valido' }, { status: 400 });
  }

  try {
    const users = await db.user.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        name: true,
        cognome: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Errore nel recupero utenti:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
