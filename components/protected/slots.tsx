'use client'

import React from 'react'
import { generateTimeSlotsForDay } from '../utils/timeslots'

export default function TimeSlotList() {
  //da aggiungere cointrollo che non vada nel passato, aggiungere un context per passare i dati del giorno selezionato dal componente calendario a questo 
  //passare a generatetimeslotsforday il giorno selezionato a calendario
  const slots = generateTimeSlotsForDay('21/4/2025')

  return (
    <div>
      <h2>Slot disponibili</h2>
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
