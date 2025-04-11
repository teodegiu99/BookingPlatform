'use server'

import { db } from '@/lib/db'

export async function deleteAppuntamento(id: string) {
  try {
    await db.appuntamento.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Errore nella cancellazione:', error)
    return { success: false, error }
  }
}