'use client'

import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { getAllAppuntamenti } from '@/actions/getAllAppuntamenti'
import { Dialog } from '@headlessui/react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

type Appuntamento = {
  id: string
  cliente: {
    nome: string | null
    cognome: string | null
    email: string
    azienda: string
    ruolo?: string | null
    numero?: string | null
  }
  orario?: string[]
}

type Option = {
  value: string
  label: string
  appuntamento: Appuntamento
}

const CACHE_KEY = 'cached_appointments'
const CACHE_TIME = 5 * 60 * 1000 // 5 minuti

export default function AppointmentSearch({
  onSelect,
}: {
  onSelect: (app: Appuntamento) => void
}) {
  const [allAppuntamenti, setAllAppuntamenti] = useState<Appuntamento[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Appuntamento | null>(null)

  const formatOption = (app: Appuntamento): Option => ({
    value: app.id,
    label: `${app.orario?.[0] ?? ''} - ${app.cliente.nome ?? ''} ${app.cliente.cognome ?? ''} - ${app.cliente.azienda} - ${app.cliente.email}`,
    appuntamento: app,
  })

  const fetchAppuntamenti = async () => {
    setLoading(true)
    const data = await getAllAppuntamenti()

    setAllAppuntamenti(data)
    setOptions(data.map(formatOption))

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data,
    }))

    setLoading(false)
  }

  useEffect(() => {
    const cache = localStorage.getItem(CACHE_KEY)
    if (cache) {
      const { timestamp, data } = JSON.parse(cache)
      if (Date.now() - timestamp < CACHE_TIME) {
        setAllAppuntamenti(data)
        setOptions(data.map(formatOption))
        return
      }
    }

    fetchAppuntamenti()
  }, [])

  useEffect(() => {
    if (!inputValue) {
      setOptions(allAppuntamenti.map(formatOption))
      return
    }

    const filtered = allAppuntamenti.filter(app => {
      const { nome, cognome, azienda, email } = app.cliente
      const search = inputValue.toLowerCase()
      return (
        nome?.toLowerCase().includes(search) ||
        cognome?.toLowerCase().includes(search) ||
        azienda.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search)
      )
    })

    setOptions(filtered.map(formatOption))
  }, [inputValue, allAppuntamenti])

  const handleChange = (selected: Option | null) => {
    if (selected) {
      onSelect(selected.appuntamento)
      setSelectedApp(selected.appuntamento)
    }
  }

  return (
    <>
      <div className="w-full border shadow-md rounded-xl p-10 h-full min-w-full">
        <h3 className="text-xl font-bold mb-2">Cerca</h3>
        <div className='flex justify-center items-center w-full'> 
          <Select
            className="w-full"
            options={options}
            isLoading={loading}
            onChange={handleChange}
            placeholder="Cerca appuntamento per nome, cognome, azienda o email..."
            isClearable
            onInputChange={(value) => setInputValue(value)}
            noOptionsMessage={() => 'Nessun risultato trovato'}
          />
        </div>
      </div>

      {/* MODALE DETTAGLI */}
      <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Dettagli Appuntamento
            </Dialog.Title>
            {selectedApp && (
              <div className="space-y-2">
                <p><strong>Nome:</strong> {selectedApp.cliente.nome} {selectedApp.cliente.cognome}</p>
                <p><strong>Azienda:</strong> {selectedApp.cliente.azienda}</p>
                <p><strong>Email:</strong> {selectedApp.cliente.email}</p>
                {selectedApp.cliente.numero && (
                  <p><strong>Telefono:</strong> {selectedApp.cliente.numero}</p>
                )}
                {selectedApp.orario && (
                  <p>
                    <strong>Orario:</strong>{' '}
                    {selectedApp.orario.length > 1
                      ? `${selectedApp.orario[0]} → ${selectedApp.orario[selectedApp.orario.length - 1]}`
                      : selectedApp.orario[0]}
                  </p>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Chiudi
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
