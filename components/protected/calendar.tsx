'use client'

import { Calendar } from "@/components/ui/calendar"
import React from 'react'

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
 
  console.log({date})

  function formatDate(date: Date) {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`
  }
  
  return (
    <div className="flex items-center justify-center mb-[25%]">
      <div className="flex border flex-col p-10 rounded-xl shadow-md">
      <div className="p-5 text-4xl text-center text-secondary">
      {date ? formatDate(date) : "Nessuna data selezionata"}
            </div>
 <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="p-5 text-2xl"
    />
    </div>
    </div>
   
  )
}