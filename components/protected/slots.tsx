'use client'

import React from 'react'
import { generateTimeSlotsForDay } from '../utils/timeslots'

export default function TimeSlotList() {
  const slots = generateTimeSlotsForDay('21/4/2025')

  return (
    <div>
      <h2>Fasce orarie per il 21/4/2025</h2>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            {slot.toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </li>
        ))}
      </ul>
    </div>
  )
}
