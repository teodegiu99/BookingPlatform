'use client'
import React, { useEffect, useId, useState } from 'react'
import Select from 'react-select'
import { getAllAppuntamentiByCommerciale } from '@/actions/getAllAppuntamenti'
import { Dialog } from '@headlessui/react'
import useSWR from 'swr'

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

export default function AppointmentSearch() {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [selectedApp, setSelectedApp] = useState<Appuntamento | null>(null)

  // SWR fetcher
  const fetcher = async (): Promise<Appuntamento[]> => {
    return await getAllAppuntamentiByCommerciale()
  }

  const { data: allAppuntamenti = [], isLoading } = useSWR('appuntamenti', fetcher, {
    refreshInterval: 5 * 60 * 1000, // 5 minuti
  })

  const formatOption = (app: Appuntamento): Option => ({
    value: app.id,
    label: `${app.orario?.[0] ?? ''} - ${app.cliente.nome ?? ''} ${app.cliente.cognome ?? ''} - ${app.cliente.azienda} - ${app.cliente.email}`,
    appuntamento: app,
  })

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
      setSelectedApp(selected.appuntamento) // Aggiorna lo stato dell'appuntamento selezionato
    }
  }

  return (
    <>
      <div className="w-full border shadow-md rounded-xl p-10 h-full min-w-full">
        <h3 className="text-xl font-bold mb-2">Cerca</h3>
        <div className="flex justify-center items-center w-full">
          <Select
            className="w-full"
            options={options}
            isLoading={isLoading}
            instanceId={useId()}
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
