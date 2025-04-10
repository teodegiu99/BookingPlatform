'use client'

import { Calendar } from "@/components/ui/calendar"
import React from 'react'

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
 
  console.log({date})
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="p-5"
    />
  )
}