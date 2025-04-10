
export function generateTimeSlotsForDay(dateStr: string): Date[] {
    const slots: Date[] = []
  
    const [day, month, year] = dateStr.split("/").map(Number)
    const start = new Date(year, month - 1, day, 9, 0) // 09:00
    const end = new Date(year, month - 1, day, 18, 0) // 18:00
  
    const current = new Date(start)
  
    while (current <= end) {
      slots.push(new Date(current))
      current.setMinutes(current.getMinutes() + 30)
    }
  
    return slots
  }