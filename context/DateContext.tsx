'use client'

import React, { createContext, useContext, useState } from 'react'

type DateContextType = {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  )
}

export const useDate = () => {
  const context = useContext(DateContext)
  if (!context) throw new Error("useDate deve essere usato dentro a DateProvider")
  return context
}
