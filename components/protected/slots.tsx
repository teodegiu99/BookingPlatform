'use client'

import React, { useState } from 'react'
import { generateTimeSlotsForDay } from '../utils/timeslots'
import { useDate } from '@/context/DateContext'

export default function TimeSlotList() {
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { selectedDate } = useDate()

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`
  }
  const slots = generateTimeSlotsForDay(formatDate(selectedDate))

  const handleSlotClick = (slot: Date) => {
    setSelectedSlots([slot])
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedSlots([])
    setIsModalOpen(false)
  }

  const addNextSlot = () => {
    if (selectedSlots.length === 0) return

    const lastSlot = selectedSlots[selectedSlots.length - 1]
    const nextIndex = slots.findIndex(s => s.getTime() === lastSlot.getTime()) + 1

    if (nextIndex < slots.length) {
      const nextSlot = slots[nextIndex]
      const expectedNextTime = new Date(lastSlot)
      expectedNextTime.setMinutes(lastSlot.getMinutes() + 30)

      if (nextSlot.getTime() === expectedNextTime.getTime()) {
        setSelectedSlots([...selectedSlots, nextSlot])
      }
    }
  }

  const formatTimeRange = () => {
    if (selectedSlots.length === 0) return ''

    const start = selectedSlots[0]
    const end = new Date(selectedSlots[selectedSlots.length - 1])
    end.setMinutes(end.getMinutes() + 30)

    return `${start.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    })} - ${end.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    console.log('Dati form:', data)
    console.log('Slot selezionati:', selectedSlots)

    closeModal()
  }

  return (
    <div className="p-4">
          {formatDate(selectedDate)}
      <h2 className="text-xl font-semibold mb-4">Slot disponibili</h2>
      <ul className="grid grid-cols-2 gap-3">
        {slots.map((slot, index) => (
          <li
            key={index}
            onClick={() => handleSlotClick(slot)}
            className={`cursor-pointer px-4 py-2 rounded-xl text-center shadow
              hover:bg-blue-200 ${
                selectedSlots.some(s => s.getTime() === slot.getTime())
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100'
              }`}
          >
            {slot.toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </li>
        ))}
      </ul>

      {isModalOpen && selectedSlots.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-2">Slot selezionato</h3>
            <p className="mb-4">{formatTimeRange()}</p>

            <div className="mb-4">
              <button
                onClick={addNextSlot}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
              >
                Aggiungi slot successivo
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="cognome">Cognome</label>
                <input
                  type="text"
                  name="cognome"
                  id="cognome"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="telefono">Numero di Telefono</label>
                <input
                  type="tel"
                  name="telefono"
                  id="telefono"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="azienda">Azienda *</label>
                <input
                  type="text"
                  name="azienda"
                  id="azienda"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="ruolo">Ruolo</label>
                <input
                  type="text"
                  name="ruolo"
                  id="ruolo"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Invia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
