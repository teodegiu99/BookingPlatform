'use server'

import { db } from '@/lib/db'

export async function getAppuntamentiByCommerciale(commercialeId: string) {
  const appuntamenti = await db.appuntamento.findMany({
    where: {
      commercialeId,
    },
    include: {
      cliente: true,
    },
  })

  return appuntamenti.map(app => ({
    id: app.id,
    orari: app.orario,
    cliente: app.cliente,
  }))
}


export async function getAppuntamentiByDayAndCommerciale(commercialeId: string, date: Date) {
    const all = await getAppuntamentiByCommerciale(commercialeId)
    const formatted = date.toLocaleDateString('it-IT')
  
    return all
      .filter(app =>
        app.orari.some((orario: string) => {
          const d = new Date(orario)
          return d.toLocaleDateString('it-IT') === formatted
        })
      )
      .map(app => ({
        id: app.id, // 👈👈👈 AGGIUNGI QUESTO CAMPO!
        orari: app.orari,
        cliente: app.cliente,
      }))
  }