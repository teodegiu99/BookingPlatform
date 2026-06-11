'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

interface FormData {
  id: string;
  nome: string;
  cognome: string;
  azienda: string;
  ruolo: string;
  email: string;
  numero: string;
  note: string;
  orari: Date[];
  invitatiIds: string[];
}

export async function updateAppuntamento(data: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: 'Non autenticato' };

  const orariISO = data.orari.map((d) => d.toISOString());
  
  // Find the existing appointment
  const existingApp = await db.appuntamento.findUnique({
    where: { id: data.id },
  });

  if (!existingApp) {
    return { success: false, message: 'Appuntamento non trovato' };
  }

  // Solo il creatore può modificare l'appuntamento
  if (existingApp.ownerId !== session.user.id) {
    return { success: false, message: 'Solo il creatore può modificare questo appuntamento' };
  }

  // Update or create cliente
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

  // Aggiorna l'appuntamento principale (l'orario non può essere cambiato per ora, ma lo manteniamo)
  await db.appuntamento.update({
    where: { id: data.id },
    data: {
      clienteId: cliente.id,
      note: data.note,
      // orario: orariISO, // Date and time cannot be modified as per requirement
      invitati: data.invitatiIds,
    },
  });

  // Trova e cancella tutte le vecchie copie degli invitati
  await db.appuntamento.deleteMany({
    where: {
      ownerId: session.user.id,
      clienteId: existingApp.clienteId,
      id: { not: data.id },
      orario: { equals: existingApp.orario },
    },
  });

  // Ricrea le copie per i nuovi invitati con i dati aggiornati
  for (const inv of data.invitatiIds) {
    await db.appuntamento.create({
      data: {
        clienteId: cliente.id,
        commercialeId: inv,
        ownerId: session.user.id,
        note: data.note,
        orario: existingApp.orario, // mantiene l'orario originale
        invitati: [],
      },
    });
  }

  revalidatePath('/');
  return { success: true };
}
