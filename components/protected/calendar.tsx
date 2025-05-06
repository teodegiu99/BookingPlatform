'use client'

import { Calendar } from "@/components/ui/calendar"
import React from 'react'
import { useDate } from "@/context/DateContext"
import { useTranslation } from "@/lib/useTranslation";

export function CalendarDemo() {
  const { selectedDate, setSelectedDate } = useDate()
  const { t } = useTranslation();

  function formatDate(date: Date) {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`
  }

  return (
    <div className="w-full flex items-center justify-center ">
      <div className="flex border flex-col xl:p-10 p-5 rounded-xl shadow-[5px] w-full justify-center items-center">
        <div className="p-5 text-4xl text-center text-secondary">
          {formatDate(selectedDate)}
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="p-5 text-4xl text-center !rounded-full"
        />
      </div>
    </div>
  )
}
