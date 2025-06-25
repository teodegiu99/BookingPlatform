import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID mancante' }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        name: true,
        cognome: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Errore fetch utente:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
