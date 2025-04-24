import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.appuntamento.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nella cancellazione:', error);
    return NextResponse.json({ error: 'Errore nel server' }, { status: 500 });
  }
}