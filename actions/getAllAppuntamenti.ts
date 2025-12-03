'use server'

import { db } from '@/lib/db'
import { auth } from "@/auth";


export async function getAllAppuntamentiByCommerciale(specificUserId?: string) {
          const session = await auth();
const userId = specificUserId || session?.user.id;

return await db.appuntamento.findMany({
    where: { commercialeId: userId },
    include: { cliente: true },
  })
}



export const getAllAppuntamenti = async () => {
  return db.appuntamento.findMany({
    include: {
      cliente: true,
      commerciale: true,
    },
  })
}