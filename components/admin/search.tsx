'use client'

import React, { useEffect, useId, useState } from 'react'
import Select from 'react-select'
import { getAllAppuntamenti } from '@/actions/getAllAppuntamenti'
import { Dialog } from '@headlessui/react'
import useSWR from 'swr'
import { useTranslation } from "@/lib/useTranslation"
import { FiTrash2 } from 'react-icons/fi'

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
  const orari = app.orario ?? []

  let orarioStr = ''
  if (orari.length > 0) {
    const start = new Date(orari[0])
    const end = new Date(orari[orari.length - 1])
    end.setMinutes(end.getMinutes() + 30) // aggiunge 30 min

    const dateStr = start.toLocaleDateString('it-IT') // es. 15/05/2025
    const startTime = start.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    const endTime = end.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })

    orarioStr = `${dateStr} ${startTime} → ${endTime}`
  }

  return {
    value: app.id,
    label: `${orarioStr} - ${app.cliente.azienda} - ${app.cliente.nome ?? ''} ${app.cliente.cognome ?? ''} - ${app.commerciale.cognome}`,
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

  const handleDeleteAppuntamento = async () => {
    if (!selectedApp) return
  
    try {
      const res = await fetch(`/api/appuntamenti/${selectedApp.id}`, {
        method: 'DELETE',
      })
  
      if (res.ok) {
        setSelectedApp(null) // chiude il modale
        // opzionale: fai un refresh dei dati con mutate
        // mutate('appuntamenti')
      } else {
        console.error(t('errdel'))
      }
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error)
    }
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
            <div className=' flex items-center justify-between'>
            <Dialog.Title className="text-xl font-semibold mb-4">
              {t('dettapp')}
            </Dialog.Title>
            <button onClick={handleDeleteAppuntamento} className="text-red-600 hover:text-red-800">
                            <FiTrash2 className="w-5 h-5" />
                          </button>
            </div>
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
             
             {selectedApp.orario && selectedApp.orario.length > 0 && (
  <p>
 
    <strong>{t('orario')}:</strong>{' '}
    {(() => {
      const start = new Date(selectedApp.orario[0])
      const end = new Date(selectedApp.orario[selectedApp.orario.length - 1])
      end.setMinutes(end.getMinutes() + 30) 

      const startStr = start.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const endStr = end.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `${startStr} → ${endStr}`;
    })()}
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