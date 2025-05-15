'use server'

import { db } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

interface FormData {
  nome: string
  cognome: string
  azienda: string
  ruolo: string
  email: string
  numero: string
  note: string
  orari: Date[] // passati dallo slot selezionato
}

export async function createAppuntamento(data: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Utente non autenticato")

  // Crea il cliente (o recupera se già esistente)
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
  })

  // Crea l'appuntamento
  await db.appuntamento.create({
    data: {
      clienteId: cliente.id,
      commercialeId: session.user.id,
      note: data.note,
      orario: data.orari.map(date => date.toISOString()),
    },
  })

  // Revalidazione se necessario
  revalidatePath('/')
}
