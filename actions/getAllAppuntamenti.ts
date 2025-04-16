'use server'

import { db } from '@/lib/db'


export async function getAllAppuntamentiByCommerciale(userId: string) {
  return await db.appuntamento.findMany({
    where: { commercialeId: userId },
    include: { cliente: true },
  })
}



export const getAllAppuntamenti = async () => {
  return db.appuntamento.findMany({
    include: {
      cliente: true,
    },
  })
}