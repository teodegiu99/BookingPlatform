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

    // --- (FIX 1) CONTROLLO COMMERCIALE PRINCIPALE ---
    // Recupera i dati del commerciale principale
    const mainCommerciale = await db.user.findUnique({
      where: { id: commercialeId },
      select: { multipleAppointment: true, cognome: true }
    });

    // Se multipleAppointment NON è true (quindi è false, null, o undefined), controlla i conflitti
    if (mainCommerciale && mainCommerciale.multipleAppointment !== true) {
      const mainOverlapping = await db.appuntamento.findFirst({
        where: {
          commercialeId: commercialeId,
          orario: { hasSome: orario },
        },
      });
      if (mainOverlapping) {
        return NextResponse.json(
          { error: `Il commerciale ${mainCommerciale.cognome} ha già un appuntamento.` },
          { status: 400 }
        );
      }
    }

    // --- (FIX 2) CONTROLLO INVITATI AGGIORNATO ---
    
    // 1. Recupera tutti i dati degli invitati in una sola chiamata
    const invitedUsers = await db.user.findMany({
      where: { id: { in: invitati } },
      select: { id: true, multipleAppointment: true, cognome: true }
    });

    // 2. Itera sui dati recuperati
    for (const invitato of invitedUsers) {
      
      // 3. Se multipleAppointment NON è true, controlla i conflitti
      if (invitato.multipleAppointment !== true) {
        const overlapping = await db.appuntamento.findFirst({
          where: {
            commercialeId: invitato.id,
            orario: { hasSome: orario },
          },
          // Non c'è bisogno di 'include' qui se usiamo 'invitato.cognome'
        });

        if (overlapping) {
          return NextResponse.json(
            { error: `Il commerciale ${invitato.cognome} ha già un appuntamento.` },
            { status: 400 }
          );
        }
      }
      // Se multipleAppointment è true, il ciclo continua senza controllare questo utente
    }

    // --- Logica Cliente (invariata) ---
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

    // --- Creazione Appuntamenti (invariata) ---
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
