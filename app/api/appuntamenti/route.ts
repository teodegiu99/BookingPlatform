import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json([], { status: 401 })
  }

  const appuntamenti = await db.appuntamento.findMany({
    where: { commercialeId: userId },
    include: { cliente: true },
  })

  return NextResponse.json(appuntamenti)
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { commercialeId, cliente, orario, note, invitati = [], force = false } = body;

    if (
      !cliente?.email ||
      !cliente?.azienda ||
      !Array.isArray(orario) ||
      orario.length === 0
    ) {
      return NextResponse.json({ error: 'Dati mancanti o invalidi' }, { status: 400 });
    }

    for (const invitatoId of invitati) {
      const overlapping = await db.appuntamento.findFirst({
        where: {
          commercialeId: invitatoId,
          orario: { hasSome: orario },
        },
        include: { commerciale: true },
      });

      if (overlapping) {
        return NextResponse.json(
          { error: `Il commerciale ${overlapping.commerciale.cognome} ha già un appuntamento.` },
          { status: 400 }
        );
      }
    }

    let existingCliente = await db.cliente.findUnique({ where: { email: cliente.email } });

    if (existingCliente && !force) {
      return NextResponse.json({ conflict: true, clienteEsistente: existingCliente }, { status: 200 });
    }

    if (!existingCliente) {
      existingCliente = await db.cliente.create({ data: cliente });
    } else {
      existingCliente = await db.cliente.update({
        where: { email: cliente.email },
        data: cliente,
      });
    }

    const appuntamentoPrincipale = await db.appuntamento.create({
      data: {
        orario,
        commercialeId,
        clienteId: existingCliente.id,
        note,
        ownerId: commercialeId,
        invitati,
      },
    });

    for (const invitatoId of invitati) {
      if (invitatoId === commercialeId) continue;

      await db.appuntamento.create({
        data: {
          orario,
          commercialeId: invitatoId,
          clienteId: existingCliente.id,
          note,
          ownerId: commercialeId,
          invitati,
        },
      });
    }

    return NextResponse.json(appuntamentoPrincipale, { status: 201 });
  } catch (error) {
    console.error('Errore creazione appuntamento:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
