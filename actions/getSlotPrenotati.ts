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
  });

  return await Promise.all(appuntamenti.map(async app => {
    const invitati = await db.user.findMany({
      where: {
        id: {
          in: app.invitati,
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    return {
      id: app.id,
      orari: app.orario,
      cliente: app.cliente,
      note: app.note,
      ownerId: app.ownerId,
      invitati, // Array di oggetti con id ed email
    };
  }));
}

export async function getAppuntamentiByDayAndCommerciale(commercialeId: string, date: Date) {
  const all = await getAppuntamentiByCommerciale(commercialeId);
  const formatted = date.toLocaleDateString('it-IT');

  return all
    .filter(app =>
      app.orari.some((orario: string) => {
        const d = new Date(orario);
        return d.toLocaleDateString('it-IT') === formatted;
      })
    )
    .map(app => ({
      id: app.id,
      orari: app.orari,
      cliente: app.cliente,
      note: app.note,
      ownerId: app.ownerId,
      invitati: app.invitati, // Include { id, email }
    }));
}
