import { auth } from '@/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { use } from 'react'

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

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { cliente, orario, commercialeId, note } = body;

//     if (
//       !cliente?.email ||
//       !cliente?.azienda ||
//       !commercialeId ||
//       !Array.isArray(orario) ||
//       orario.length === 0
//     ) {
//       return NextResponse.json({ error: 'Dati mancanti o invalidi' }, { status: 400 });
//     }

//     // Verifica se il cliente esiste già tramite l'email
//     let existingCliente = await db.cliente.findUnique({
//       where: { email: cliente.email },
//     });

//     // Se non esiste, crealo
//     if (!existingCliente) {
//       existingCliente = await db.cliente.create({
//         data: {
//           nome: cliente.nome,
//           cognome: cliente.cognome,
//           azienda: cliente.azienda,
//           ruolo: cliente.ruolo,
//           email: cliente.email,
//           numero: cliente.telefono,
//         },
//       });
//     } else {
//       existingCliente = await db.cliente.update({
//         where: { email: cliente.email },
//         data: {
//           nome: cliente.nome,
//           cognome: cliente.cognome,
//           azienda: cliente.azienda,
//           ruolo: cliente.ruolo,
//           numero: cliente.telefono,
//         },
//       });
//     }
    

//     // Crea l'appuntamento collegandolo al cliente trovato/creato
//     const appuntamento = await db.appuntamento.create({
//       data: {
//         orario,
//         commercialeId,
//         clienteId: existingCliente.id,
//         note,

//       },
//     });

//     return NextResponse.json(appuntamento, { status: 201 });
//   } catch (error) {
//     console.error("Errore nella creazione dell'appuntamento:", error);
//     return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
//   }
// }
// import { auth } from '@/auth';
// import { db } from '@/lib/db';
// import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // const session = await auth();
    // const commercialeId = session?.user?.id;

 
    const body = await req.json();
    const { commercialeId, cliente, orario, note, invitati = [] } = body;

    // Validazione dei dati
    if (
      !cliente?.email ||
      !cliente?.azienda ||
      !Array.isArray(orario) ||
      orario.length === 0
    ) {
      return NextResponse.json({ error: 'Dati mancanti o invalidi' }, { status: 400 });
    }
    // Verifica che gli invitati siano liberi in quegli orari
    for (const invitatoId of body.invitati) {
      const overlapping = await db.appuntamento.findFirst({
        where: {
          commercialeId: invitatoId,
          orario: {
            hasSome: body.orario, // slot sovrapposti
          },
        },
      });

      if (overlapping) {
        return NextResponse.json(
          { error: `Il commerciale con ID ${invitatoId} ha già un appuntamento in uno degli orari selezionati.` },
          { status: 400 }
        );
      }
    }

    // Cerca o crea cliente
    let existingCliente = await db.cliente.findUnique({
      where: { email: cliente.email },
    });

    if (!existingCliente) {
      existingCliente = await db.cliente.create({
        data: {
          nome: cliente.nome,
          cognome: cliente.cognome,
          azienda: cliente.azienda,
          ruolo: cliente.ruolo,
          email: cliente.email,
          numero: cliente.telefono,
        },
      });
    } else {
      existingCliente = await db.cliente.update({
        where: { email: cliente.email },
        data: {
          nome: cliente.nome,
          cognome: cliente.cognome,
          azienda: cliente.azienda,
          ruolo: cliente.ruolo,
          numero: cliente.telefono,
        },
      });
    }

    // Crea appuntamento principale con lista invitati
    const appuntamentoPrincipale = await db.appuntamento.create({
      data: {
        orario,
        commercialeId,
        clienteId: existingCliente.id,
        note,
        ownerId: commercialeId,
        invitati, // array di id stringa
      },
    });
    await db.appuntamento.create({
      data: {
        orario,
        commercialeId,
        clienteId: existingCliente.id,
        note,
        ownerId: commercialeId,
        invitati, 
      }
    });
    // Crea appuntamenti duplicati per ogni invitato (escludendo il creatore)
    for (const invitatoId of invitati) {
      if (invitatoId === commercialeId) continue;

      await db.appuntamento.create({
        data: {
          orario,
          commercialeId: invitatoId,
          clienteId: existingCliente.id,
          note,
          ownerId: commercialeId,
          invitati: [], // nei duplicati lasciamo vuoto
        },
      });
    }

    return NextResponse.json(appuntamentoPrincipale, { status: 201 });
  } catch (error) {
    console.error('Errore nella creazione dell\'appuntamento:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
