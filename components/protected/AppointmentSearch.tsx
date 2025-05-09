
'use client'
import React, { useEffect, useId, useState, useCallback } from 'react'
import Select from 'react-select'
import { getAllAppuntamentiByCommerciale } from '@/actions/getAllAppuntamenti'
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
  orario?: string[]
}

type Option = {
  value: string
  label: string
  appuntamento: Appuntamento
}

export default function AppointmentSearch() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [selectedApp, setSelectedApp] = useState<Appuntamento | null>(null)
  const selectInstanceId = useId()

  const fetcher = async (): Promise<Appuntamento[]> => {
    return await getAllAppuntamentiByCommerciale()
  }

  const { data: allAppuntamenti = [], isLoading } = useSWR('appuntamenti', fetcher, {
    refreshInterval: 0.2 * 60 * 1000,
  })

  const formatOption = useCallback((app: Appuntamento): Option => ({
    value: app.id,
    label: `${app.orario?.[0] ?? ''} - ${app.cliente.nome ?? ''} ${app.cliente.cognome ?? ''} - ${app.cliente.azienda} - ${app.cliente.email}`,
    appuntamento: app,
  }), [])

  useEffect(() => {
    const search = inputValue.toLowerCase()
    const filtered = inputValue
      ? allAppuntamenti.filter(app => {
          const { nome, cognome, azienda, email } = app.cliente
          return (
            nome?.toLowerCase().includes(search) ||
            cognome?.toLowerCase().includes(search) ||
            azienda.toLowerCase().includes(search) ||
            email.toLowerCase().includes(search)
          )
        })
      : allAppuntamenti

    const newOptions = filtered.map(formatOption)
    const isEqual = JSON.stringify(newOptions) === JSON.stringify(options)

    if (!isEqual) {
      setOptions(newOptions)
    }
  }, [inputValue, allAppuntamenti, formatOption])

  const handleChange = (selected: Option | null) => {
    setSelectedApp(selected?.appuntamento ?? null)
  }

  return (
    <>
      <div className="w-full border shadow-md rounded-xl p-6 grow">
        <h3 className="text-xl font-semibold mb-2 text-secondary">{t('cerca')}</h3>
        <div className="flex justify-center items-center w-full">
          <Select
            className="w-full "
            options={options}
            isLoading={isLoading}
            instanceId={selectInstanceId}
            onChange={handleChange}
            placeholder={t('cercaper')}
            isClearable
            onInputChange={(value) => setInputValue(value)}
            noOptionsMessage={() => t('noresult')}
          />
        </div>
      </div>

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
                <p><strong>Email:</strong> {selectedApp.cliente.email}</p>
                {selectedApp.cliente.numero && (
                  <p><strong>{t('telefono')}:</strong> {selectedApp.cliente.numero}</p>
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
