'use client'

import React, { useEffect, useId, useState } from 'react'
import Select from 'react-select'
import { getAllAppuntamenti } from '@/actions/getAllAppuntamenti'
import { Dialog } from '@headlessui/react'
import useSWR from 'swr'
import { useTranslation } from "@/lib/useTranslation"

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
  commerciale: {
    name?: string | null
    cognome?: string | null
    societa?: string | null
  }
  orario?: string[]
  note?: string | null
}

type Option = {
  value: string
  label: string
  appuntamento: Appuntamento
}

// ✅ funzione spostata fuori dal componente
function formatOption(app: Appuntamento): Option {
  return {
    value: app.id,
    label: `${app.orario?.[0] ?? ''} - ${app.cliente.nome ?? ''} ${app.cliente.cognome ?? ''} - ${app.cliente.azienda} - ${app.cliente.email}`,
    appuntamento: app,
  }
}

export default function Search() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [selectedApp, setSelectedApp] = useState<Appuntamento | null>(null)
  const selectInstanceId = useId()

  const fetcher = async (): Promise<Appuntamento[]> => {
    return await getAllAppuntamenti()
  }

  const { data: allAppuntamenti = [], isLoading } = useSWR('appuntamenti', fetcher, {
    refreshInterval: 0.2 * 60 * 1000,
  })

  useEffect(() => {
    const search = inputValue.toLowerCase()
    const filtered = inputValue
  ? allAppuntamenti.filter(({ cliente, commerciale }) => {
      return (
        cliente.nome?.toLowerCase().includes(search) ||
        cliente.cognome?.toLowerCase().includes(search) ||
        cliente.azienda.toLowerCase().includes(search) ||
        cliente.email.toLowerCase().includes(search) ||
        cliente.numero?.includes(search) ||
        commerciale.name?.toLowerCase().includes(search) ||
        commerciale.cognome?.toLowerCase().includes(search) ||
        commerciale.societa?.toLowerCase().includes(search)
      )
    })
  : allAppuntamenti

    setOptions(filtered.map(formatOption))
  }, [inputValue, allAppuntamenti])

  const handleChange = (selected: Option | null) => {
    setSelectedApp(selected?.appuntamento ?? null)
  }

  return (
    <>
      <div className="flex justify-center items-center xl:w-[40%] p-5 min-w-[40%]">
        <Select
          className="w-full"
          options={options}
          isLoading={isLoading}
          instanceId={selectInstanceId}
          onChange={handleChange}
          placeholder={t('cercaper')}
          isClearable
          onInputChange={value => setInputValue(value)}
          noOptionsMessage={() => t('noresult')}
        />
      </div>

      {/* MODALE DETTAGLI */}
      <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">
              {t('dettapp')}
            </Dialog.Title>
            {selectedApp && (
              <div className="space-y-2">
                <p><strong>{t('nome')}:</strong> {selectedApp.cliente.nome} {selectedApp.cliente.cognome}</p>
                <p><strong>{t('azienda')}:</strong> {selectedApp.cliente.azienda}</p>
                {selectedApp.cliente.ruolo && (
                  <p><strong>{t('ruolo')}:</strong> {selectedApp.cliente.ruolo}</p>
                )}
                <p><strong>Email:</strong> {selectedApp.cliente.email}</p>

                {selectedApp.cliente.numero && (
                  <p><strong>{t('telefono')}:</strong> {selectedApp.cliente.numero}</p>
                )}
                     {selectedApp.commerciale.cognome && (
                  <p><strong>{t('commerciale')}:</strong> {selectedApp.commerciale.cognome}</p>
                )}
                     {selectedApp.commerciale.societa && (
                  <p><strong>{t('societa')}:</strong> {selectedApp.commerciale.societa}</p>
                )}
             
                {selectedApp.orario && (
                  <p>
                    <strong>{t('orario')}:</strong>{' '}
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
                {t('chiudi')}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
