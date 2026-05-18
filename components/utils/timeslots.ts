const ITALY_TIME_ZONE = 'Europe/Rome'

const pad = (value: number) => value.toString().padStart(2, '0')

function parseItalianDay(dateStr: string) {
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number)
    return { day, month, year }
  }

  const [year, month, day] = dateStr.split('-').map(Number)
  return { day, month, year }
}

function getItalyOffset(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ITALY_TIME_ZONE,
    timeZoneName: 'shortOffset',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const tzPart = parts.find((part) => part.type === 'timeZoneName')?.value ?? ''
  const match = tzPart.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/) ?? []
  const sign = match[1]?.startsWith('-') ? '-' : '+'
  const hours = match[1] ? pad(Number(match[1].replace(/[+-]/, ''))) : '01'
  const minutes = match[2] ?? '00'

  return `${sign}${hours}:${pad(Number(minutes))}`
}

export function buildItalyIsoDatetime(dateStr: string, timeStr: string) {
  const { year, month, day } = parseItalianDay(dateStr)
  const [hour, minute] = timeStr.split(':').map(Number)
  const candidateDate = new Date(Date.UTC(year, month - 1, day, hour, minute))
  const offset = getItalyOffset(candidateDate)
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${offset}`
}

export function generateTimeSlotsForDay(dateStr: string): string[] {
  const slots: string[] = []
  const { day, month, year } = parseItalianDay(dateStr)

  for (let hour = 9; hour <= 18; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
      slots.push(buildItalyIsoDatetime(`${year}-${pad(month)}-${pad(day)}`, `${pad(hour)}:${pad(minute)}`))
    }
  }

  return slots
}

export function filterBookedTimeSlots(
  allSlots: string[],
  bookedSlots: Date[]
): string[] {
  return allSlots.filter((slot) =>
    !bookedSlots.some((booked) =>
      new Date(slot).getTime() === new Date(booked).getTime()
    )
  )
}

export function formatItalyDate(date: Date) {
  return date.toLocaleDateString('it-IT', {
    timeZone: ITALY_TIME_ZONE,
  })
}

export function formatItalyTime(date: Date) {
  return date.toLocaleTimeString('it-IT', {
    timeZone: ITALY_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
  })
}
  