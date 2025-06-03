import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      cliente,
      orario,
      commercialeId,
      note,
      invitati = [],
    } = body;

    // Step 1: Crea il cliente (o recuperalo se già esiste)
    const existingCliente = await db.cliente.findUnique({
      where: { email: cliente.email },
    });

    const savedCliente = existingCliente ?? await db.cliente.create({
      data: cliente,
    });

    // Step 2: Controlla disponibilità degli invitati
    const invitatiDisponibili: string[] = [];

    for (const invitatoId of invitati) {
      const overlapping = await db.appuntamento.findFirst({
        where: {
          commercialeId: invitatoId,
          orario: {
            hasSome: orario,
          },
        },
      });

      if (!overlapping) {
        invitatiDisponibili.push(invitatoId);
      }
    }

    // Step 3: Crea l'appuntamento principale
    const mainAppuntamento = await db.appuntamento.create({
      data: {
        clienteId: savedCliente.id,
        commercialeId,
        orario,
        note,
        ownerId: commercialeId,
        invitati: invitatiDisponibili,
      },
    });

    // Step 4: Crea appuntamenti duplicati per gli invitati disponibili
    await Promise.all(
      invitatiDisponibili.map((invId) =>
        db.appuntamento.create({
          data: {
            clienteId: savedCliente.id,
            commercialeId: invId,
            orario,
            note,
            ownerId: commercialeId,
            invitati: [], // un invitato non invita altri
          },
        })
      )
    );

    return NextResponse.json({ message: 'Appuntamenti creati con successo' }, { status: 201 });

  } catch (error) {
    console.error('Errore durante la creazione appuntamento:', error);
    return NextResponse.json({ error: 'Errore nella creazione' }, { status: 500 });
  }
}
