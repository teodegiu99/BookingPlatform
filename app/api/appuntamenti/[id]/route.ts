// import { db } from '@/lib/db';
// import { NextResponse } from 'next/server';

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await db.appuntamento.delete({
//       where: { id: params.id },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Errore nella cancellazione:', error);
//     return NextResponse.json({ error: 'Errore nel server' }, { status: 500 });
//   }
// }

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Recupera l'appuntamento originale
    const appuntamento = await db.appuntamento.findUnique({
      where: { id: params.id },
    });

    if (!appuntamento) {
      return NextResponse.json({ error: 'Appuntamento non trovato' }, { status: 404 });
    }

    // Se è l'appuntamento del proprietario, cancella anche tutti quelli collegati
    if (appuntamento.commercialeId === appuntamento.ownerId) {
      await db.appuntamento.deleteMany({
        where: {
          ownerId: appuntamento.ownerId,
          orario: {
            equals: appuntamento.orario,
          },
          clienteId: appuntamento.clienteId,
        },
      });

      return NextResponse.json({ success: true, cascata: true });
    }

    // Altrimenti cancella solo questo
    await db.appuntamento.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, cascata: false });
  } catch (error) {
    console.error('Errore nella cancellazione:', error);
    return NextResponse.json({ error: 'Errore nel server' }, { status: 500 });
  }
}
