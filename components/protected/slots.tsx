'use client'

import React, { useEffect,useRef, useState } from 'react'
import { useDate } from '@/context/DateContext'
import { createAppuntamento } from '@/actions/createAppuntamento'
import { getAvailableSlotsByDay } from '@/actions/getSlotLiberi'
import { useSession } from 'next-auth/react'
import { getAppuntamentiByDayAndCommerciale } from '@/actions/getSlotPrenotati'
import { FiTrash2 } from 'react-icons/fi'
import { deleteAppuntamento } from '@/actions/deleteSlot'

export default function TimeSlotList() {
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { selectedDate } = useDate()
  const [loading, setLoading] = useState(true)
  const [slots, setSlots] = useState<Date[]>([])
  const { data: session } = useSession()
  const [booked, setBooked] = useState<{ orari: string[]; cliente: any, id: string }[]>([])
  const [selectedAppuntamento, setSelectedAppuntamento] = useState<any | null>(null)

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  const fetchData = async () => {
    if (!session?.user?.id) return

    const formattedDate = selectedDate.toLocaleDateString('it-IT')

    const available = await getAvailableSlotsByDay(formattedDate, session.user.id!)
    setSlots(available.map((s: any) => new Date(s)))

    const allApp = await getAppuntamentiByDayAndCommerciale(session.user.id!, selectedDate)
    const ofThatDay = allApp.filter(app =>
      app.orari.some((str: string) => {
        const date = new Date(str)
        return date.toLocaleDateString('it-IT') === formattedDate
      })
    )
    setBooked(ofThatDay)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [selectedDate, session?.user?.id])

  if (loading) return <p>Caricamento slot disponibili...</p>

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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      await createAppuntamento({
        nome: data.nome as string,
        cognome: data.cognome as string,
        azienda: data.azienda as string,
        ruolo: data.ruolo as string,
        email: data.email as string,
        numero: data.telefono as string,
        orari: selectedSlots,
      })
      formRef.current?.reset()
      alert('Appuntamento creato con successo!')
      closeModal()
      fetchData()
    } catch (error) {
      console.error('Errore durante la creazione:', error)
      alert('Errore nella creazione dell\'appuntamento')
    }
  }

  const handleBookedClick = (app: any) => {
    setSelectedAppuntamento(app)
  }

  const handleDeleteAppuntamento = async () => {
    if (!selectedAppuntamento) return
    const confirmDelete = confirm("Sei sicuro di voler cancellare questo appuntamento?")


    const res = await deleteAppuntamento(selectedAppuntamento.id)
    if (res.success) {
      // alert("Appuntamento cancellato con successo")
      setSelectedAppuntamento(null)
      fetchData()
    } else {
      alert("Errore nella cancellazione")
    }
  }

  return (
    <div className="flex items-center justify-center xl:mb-[25%]">
      <div className="grid grid-cols-2 gap-2 border p-10 rounded-xl shadow-[5px] overflow-auto">
        <div>
          <h2 className="text-xl font-semibold mb-4">Slot disponibili</h2>
          <ul className="grid  grid-cols-2 gap-3">
            {slots.map((slot, index) => (
              <li
                key={index}
                onClick={() => handleSlotClick(slot)}
                className={`cursor-pointer px-4 py-2 font-semibold rounded-[5px] text-center text-primary border border-primary hover:border-secondary hover:text-secondary shadow hover:shadow-xl
                hover:bg-blue-200 ${
                  selectedSlots.some(s => s.getTime() === slot.getTime())
                    
                }`}
              >
                {slot.toLocaleTimeString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Slot occupati</h2>
          <ul className="grid grid-cols-2 gap-3">
            {booked.flatMap(app => app.orari.map((orario: string, i: number) => (
              <li
                key={`${app.id}-${i}`}
                onClick={() => handleBookedClick(app)}
                className="cursor-pointer px-4 py-2 rounded-[5px] text-center text-primary border border-primary hover:border-secondary hover:text-secondary shadow hover:shadow-xl"
              >
                {new Date(orario).toLocaleTimeString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </li>
            )))}
          </ul>
        </div>
      </div>

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

            <form ref={formRef} onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label htmlFor="nome">Nome</label>
                <input type="text" name="nome" id="nome" className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-1">
                <label htmlFor="cognome">Cognome</label>
                <input type="text" name="cognome" id="cognome" className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-1">
                <label htmlFor="telefono">Numero di Telefono</label>
                <input type="tel" name="telefono" id="telefono" className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-1">
                <label htmlFor="email">Email *</label>
                <input type="email" name="email" id="email" required className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-1">
                <label htmlFor="azienda">Azienda *</label>
                <input type="text" name="azienda" id="azienda" required className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-1">
                <label htmlFor="ruolo">Ruolo</label>
                <input type="text" name="ruolo" id="ruolo" className="w-full p-2 border rounded" />
              </div>

              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400">Annulla</button>
                <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-blue-700">Invia</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAppuntamento && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Dettagli appuntamento</h3>
              <button onClick={handleDeleteAppuntamento} className="text-red-600 hover:text-red-800">
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
            <ul className="mb-4">
              <li><strong>Nome:</strong> {selectedAppuntamento.cliente.nome} {selectedAppuntamento.cliente.cognome}</li>
              <li><strong>Email:</strong> {selectedAppuntamento.cliente.email}</li>
              <li><strong>Azienda:</strong> {selectedAppuntamento.cliente.azienda}</li>
              <li><strong>Ruolo:</strong> {selectedAppuntamento.cliente.ruolo}</li>
              <li><strong>Telefono:</strong> {selectedAppuntamento.cliente.numero}</li>
              <li><strong>Orari:</strong> {selectedAppuntamento.orari.map((o: string) => new Date(o).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })).join(', ')}</li>
            </ul>
            <div className="flex justify-end">
              <button onClick={() => setSelectedAppuntamento(null)} className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400">Chiudi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
