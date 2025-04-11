'use server'

import { db } from '@/lib/db'
import { generateTimeSlotsForDay, filterBookedTimeSlots } from '../components/utils/timeslots'

export async function getAvailableSlotsByDay(dateStr: string, commercialeId: string) {
  const [day, month, year] = dateStr.split("/").map(Number)
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0)
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59)

  // Prendiamo tutti gli appuntamenti del commerciale
  const appuntamenti = await db.appuntamento.findMany({
    where: {
      commercialeId,
    },
    select: {
      orario: true,
    },
  })

  // Convertiamo gli orari in Date e teniamo solo quelli del giorno selezionato
  const bookedSlots = appuntamenti
    .flatMap(app => app.orario)
    .map(str => new Date(str))
    .filter(date => date >= startOfDay && date <= endOfDay)

  // Generiamo tutti gli slot e li filtriamo
  const allSlots = generateTimeSlotsForDay(dateStr)
  const availableSlots = filterBookedTimeSlots(allSlots, bookedSlots)

  return availableSlots
}
