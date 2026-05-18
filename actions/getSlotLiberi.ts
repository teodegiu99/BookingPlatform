'use server'

import { db } from '@/lib/db'
import { buildItalyIsoDatetime, generateTimeSlotsForDay, filterBookedTimeSlots } from '../components/utils/timeslots'

export async function getAvailableSlotsByDay(dateStr: string, commercialeId: string) {
  const [day, month, year] = dateStr.split('/').map(Number)
  const startOfDay = new Date(buildItalyIsoDatetime(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, '00:00'))
  const endOfDay = new Date(buildItalyIsoDatetime(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, '23:59'))

  const appuntamenti = await db.appuntamento.findMany({
    where: {
      commercialeId,
    },
    select: {
      orario: true,
    },
  })

  const bookedSlots = appuntamenti
    .flatMap(app => app.orario)
    .map(str => new Date(str))
    .filter(date => date >= startOfDay && date <= endOfDay)

  const allSlots = generateTimeSlotsForDay(dateStr)
  const availableSlots = filterBookedTimeSlots(allSlots, bookedSlots)

  return availableSlots
}
