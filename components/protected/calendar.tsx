'use client'

import { Calendar } from "@/components/ui/calendar"
import React from 'react'
import { useDate } from "@/context/DateContext"

export function CalendarDemo() {
  const { selectedDate, setSelectedDate } = useDate()

  function formatDate(date: Date) {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`
  }

  return (
    <div className="flex items-center justify-center xl:mb-[25%]">
      <div className="flex border flex-col xl:p-10 p-5 rounded-xl shadow-[5px]">
        <div className="p-5 text-4xl text-center text-secondary">
          {formatDate(selectedDate)}
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="p-5 text-4xl !rounded-full"
        />
      </div>
    </div>
  )
}
