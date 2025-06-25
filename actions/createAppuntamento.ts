// // 'use server'

// // import { db } from '@/lib/db'
// // import { auth } from '@/auth'
// // import { revalidatePath } from 'next/cache'

// // interface FormData {
// //   nome: string
// //   cognome: string
// //   azienda: string
// //   ruolo: string
// //   email: string
// //   numero: string
// //   note: string
// //   orari: Date[] // passati dallo slot selezionato
// // }

// // export async function createAppuntamento(data: FormData) {
// //   const session = await auth()
// //   if (!session?.user?.id) throw new Error("Utente non autenticato")

// //   // Crea il cliente (o recupera se già esistente)
// //   const cliente = await db.cliente.upsert({
// //     where: { email: data.email },
// //     update: {
// //       nome: data.nome,
// //       cognome: data.cognome,
// //       azienda: data.azienda,
// //       ruolo: data.ruolo,
// //       numero: data.numero,
// //     },
// //     create: {
// //       nome: data.nome,
// //       cognome: data.cognome,
// //       azienda: data.azienda,
// //       ruolo: data.ruolo,
// //       email: data.email,
// //       numero: data.numero,
// //     },
// //   })

// //   // Crea l'appuntamento
// //   await db.appuntamento.create({
// //     data: {
// //       clienteId: cliente.id,
// //       commercialeId: session.user.id,
// //       ownerId: session.user.id, 
// //       note: data.note,
// //       orario: data.orari.map(date => date.toISOString()),
// //       invitati: [],
// //     },
// //   })

// //   // Revalidazione se necessario
// //   revalidatePath('/')
// // }


// // 'use server'

// // import { db } from '@/lib/db'
// // import { auth } from '@/auth'
// // import { revalidatePath } from 'next/cache'

// // interface FormData {
// //   nome: string
// //   cognome: string
// //   azienda: string
// //   ruolo: string
// //   email: string
// //   numero: string
// //   note: string
// //   orari: Date[]
// //   invitatiIds?: string[]
// // }

// // export async function createAppuntamento(data: FormData) {
// //   const session = await auth()
// //   if (!session?.user?.id) {
// //     return { success: false, message: 'Utente non autenticato' }
// //   }

// //   // Verifica disponibilità invitati
// //   if (data.invitatiIds && data.invitatiIds.length > 0) {
// //     const allAppuntamenti = await db.appuntamento.findMany({
// //       where: {
// //         commercialeId: { in: data.invitatiIds },
// //         orario: { hasSome: data.orari.map(o => o.toISOString()) }
// //       },
// //     })

// //     if (allAppuntamenti.length > 0) {
// //       return {
// //         success: false,
// //         message: 'Uno o più invitati sono occupati in questo orario.',
// //       }
// //     }
// //   }

// //   const cliente = await db.cliente.upsert({
// //     where: { email: data.email },
// //     update: {
// //       nome: data.nome,
// //       cognome: data.cognome,
// //       azienda: data.azienda,
// //       ruolo: data.ruolo,
// //       numero: data.numero,
// //     },
// //     create: {
// //       nome: data.nome,
// //       cognome: data.cognome,
// //       azienda: data.azienda,
// //       ruolo: data.ruolo,
// //       email: data.email,
// //       numero: data.numero,
// //     },
// //   })

// //   await db.appuntamento.create({
// //     data: {
// //       clienteId: cliente.id,
// //       commercialeId: session.user.id,
// //       ownerId: session.user.id,
// //       note: data.note,
// //       orario: data.orari.map(date => date.toISOString()),
// //       invitati: data.invitatiIds ?? [],
// //     },
// //   })

// //   revalidatePath('/')
// //   return { success: true }
// // }


// 'use server';

// import { db } from '@/lib/db';
// import { auth } from '@/auth';
// import { revalidatePath } from 'next/cache';

// interface FormData {
//   nome: string;
//   cognome: string;
//   azienda: string;
//   ruolo: string;
//   email: string;
//   numero: string;
//   note: string;
//   orari: Date[];
//   invitatiIds: string[];
// }

// export async function createAppuntamento(data: FormData) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return { success: false, message: 'Utente non autenticato' };
//   }

//   const orariISO = data.orari.map((d) => d.toISOString());
//   const allIds = [session.user.id, ...data.invitatiIds];

//   const occupati = await db.appuntamento.findMany({
//     where: {
//       commercialeId: { in: allIds },
//       orario: { hasSome: orariISO },
//     },
//     include: { commerciale: true },
//   });

//   if (occupati.length > 0) {
//     return {
//       success: false,
//       message: `Il commerciale ${occupati[0].commerciale.cognome} è già occupato.`,
//     };
//   }

//   const cliente = await db.cliente.upsert({
//     where: { email: data.email },
//     update: {
//       nome: data.nome,
//       cognome: data.cognome,
//       azienda: data.azienda,
//       ruolo: data.ruolo,
//       numero: data.numero,
//     },
//     create: {
//       nome: data.nome,
//       cognome: data.cognome,
//       azienda: data.azienda,
//       ruolo: data.ruolo,
//       email: data.email,
//       numero: data.numero,
//     },
//   });

//   await db.appuntamento.create({
//     data: {
//       clienteId: cliente.id,
//       commercialeId: session.user.id,
//       ownerId: session.user.id,
//       note: data.note,
//       orario: orariISO,
//       invitati: data.invitatiIds,
//     },
//   });

//   for (const invId of data.invitatiIds) {
//     await db.appuntamento.create({
//       data: {
//         clienteId: cliente.id,
//         commercialeId: invId,
//         ownerId: session.user.id,
//         note: data.note,
//         orario: orariISO,
//         invitati: [],
//       },
//     });
//   }

//   revalidatePath('/');
//   return { success: true };
// }


'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

interface FormData {
  nome: string;
  cognome: string;
  azienda: string;
  ruolo: string;
  email: string;
  numero: string;
  note: string;
  orari: Date[];
  invitatiIds: string[];
  force?: boolean;
}

export async function createAppuntamento(data: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: 'Non autenticato' };

  const orariISO = data.orari.map(d => d.toISOString());
  const allIds = [session.user.id, ...data.invitatiIds];

  const occupati = await db.appuntamento.findMany({
    where: { commercialeId: { in: allIds }, orario: { hasSome: orariISO } },
    include: { commerciale: true },
  });
  if (occupati.length)
    return { success: false, message: `Commerciale ${occupati[0].commerciale.cognome} occupato in orario.` };

  const existingCliente = await db.cliente.findUnique({ where: { email: data.email } });
  if (existingCliente && !data.force) {
    return { conflict: true, clienteEsistente: existingCliente };
  }

  const cliente = await db.cliente.upsert({
    where: { email: data.email },
    update: {
      nome: data.nome,
      cognome: data.cognome,
      azienda: data.azienda,
      ruolo: data.ruolo,
      numero: data.numero,
    },
    create: {
      nome: data.nome,
      cognome: data.cognome,
      azienda: data.azienda,
      ruolo: data.ruolo,
      email: data.email,
      numero: data.numero,
    },
  });

  await db.appuntamento.create({ data: {
    clienteId: cliente.id,
    commercialeId: session.user.id,
    ownerId: session.user.id,
    note: data.note,
    orario: orariISO,
    invitati: data.invitatiIds
  }});

  for (const inv of data.invitatiIds) {
    await db.appuntamento.create({ data: {
      clienteId: cliente.id,
      commercialeId: inv,
      ownerId: session.user.id,
      note: data.note,
      orario: orariISO,
      invitati: []
    }});
  }

  revalidatePath('/');
  return { success: true };
}
