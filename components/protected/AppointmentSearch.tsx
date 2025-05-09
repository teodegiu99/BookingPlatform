
// 'use client'
// import React, { useEffect, useId, useState, useCallback } from 'react'
// import Select from 'react-select'
// import { getAllAppuntamentiByCommerciale } from '@/actions/getAllAppuntamenti'
// import { Dialog } from '@headlessui/react'
// import useSWR from 'swr'
// import { useTranslation } from "@/lib/useTranslation"


// const customStyles = {
//   control: (base: any, state: any) => ({
//     ...base,
//     borderWidth: '2px',
//     borderRadius: '0.75rem', // rounded-xl
//     padding: '0.25rem 0.5rem',
//     borderColor: state.isFocused ? '#e62c33' : '#d1d5db', // primary vs gray-300
//     boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 255, 255, 0.5)' : 'none', // ring-primary/50
//     '&:hover': {
//       borderColor: state.isFocused ? '#e62c33' : '#e62c33', // gray-400 on hover
//     },
//   }),
//   option: (base: any, state: any) => ({
//     ...base,
//     backgroundColor: state.isSelected
//       ? 'rgba(230, 44, 51, 1)' // selected = primary
//       : state.isFocused
//       ? 'rgba(230, 44, 51, 0.2)' // focused = primary/25
//       : 'white',
//     color: state.isSelected ? 'white' : 'black',
//     padding: '0.5rem 1rem',
//     cursor: 'pointer',
//   }),
//   menu: (base: any) => ({
//     ...base,
//     borderRadius: '0.75rem',
//     boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
//     zIndex: 20,
//   }),
// }



// type Appuntamento = {
//   id: string
//   cliente: {
//     nome: string | null
//     cognome: string | null
//     email: string
//     azienda: string
//     ruolo?: string | null
//     numero?: string | null
//   }
//   orario?: string[]
// }

// type Option = {
//   value: string
//   label: string
//   appuntamento: Appuntamento
// }

// export default function AppointmentSearch() {
//   const { t } = useTranslation()
//   const [inputValue, setInputValue] = useState('')
//   const [options, setOptions] = useState<Option[]>([])
//   const [selectedApp, setSelectedApp] = useState<Appuntamento | null>(null)
//   const selectInstanceId = useId()

//   const fetcher = async (): Promise<Appuntamento[]> => {
//     return await getAllAppuntamentiByCommerciale()
//   }

//   const { data: allAppuntamenti = [], isLoading } = useSWR('appuntamenti', fetcher, {
//     refreshInterval: 0.2 * 60 * 1000,
//   })

//   const formatOption = useCallback((app: Appuntamento): Option => ({
//     value: app.id,
//     label: `${app.orario?.[0] ?? ''} - ${app.cliente.nome ?? ''} ${app.cliente.cognome ?? ''} - ${app.cliente.azienda} - ${app.cliente.email}`,
//     appuntamento: app,
//   }), [])

//   useEffect(() => {
//     const search = inputValue.toLowerCase()
//     const filtered = inputValue
//       ? allAppuntamenti.filter(app => {
//           const { nome, cognome, azienda, email } = app.cliente
//           return (
//             nome?.toLowerCase().includes(search) ||
//             cognome?.toLowerCase().includes(search) ||
//             azienda.toLowerCase().includes(search) ||
//             email.toLowerCase().includes(search)
//           )
//         })
//       : allAppuntamenti

//     const newOptions = filtered.map(formatOption)
//     const isEqual = JSON.stringify(newOptions) === JSON.stringify(options)

//     if (!isEqual) {
//       setOptions(newOptions)
//     }
//   }, [inputValue, allAppuntamenti, formatOption])

//   const handleChange = (selected: Option | null) => {
//     setSelectedApp(selected?.appuntamento ?? null)
//   }

//   return (
//     <>
//       <div className="w-full border shadow-md rounded-xl p-6 grow">
//         <h3 className="text-xl font-semibold mb-2 text-secondary">{t('cerca')}</h3>
//         <div className="flex justify-center items-center w-full">
//           <Select
//             className="w-full "
//             options={options}
//             isLoading={isLoading}
//             instanceId={selectInstanceId}
//             onChange={handleChange}
//             placeholder={t('cercaper')}
//             isClearable
//             onInputChange={(value) => setInputValue(value)}
//             noOptionsMessage={() => t('noresult')}
//             styles={customStyles}
//           />
//         </div>
//       </div>

//       <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} className="relative z-50">
//         <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
//             <Dialog.Title className="text-xl font-semibold mb-4">
//               {t('dettapp')}
//             </Dialog.Title>
//             {selectedApp && (
//               <div className="space-y-2">
//                 <p><strong>{t('nome')}:</strong> {selectedApp.cliente.nome} {selectedApp.cliente.cognome}</p>
//                 <p><strong>{t('azienda')}:</strong> {selectedApp.cliente.azienda}</p>
//                 <p><strong>Email:</strong> {selectedApp.cliente.email}</p>
//                 {selectedApp.cliente.numero && (
//                   <p><strong>{t('telefono')}:</strong> {selectedApp.cliente.numero}</p>
//                 )}
//                 {selectedApp.orario && (
//                   <p>
//                     <strong>{t('orario')}:</strong>{' '}
//                     {selectedApp.orario.length > 1
//                       ? `${selectedApp.orario[0]} → ${selectedApp.orario[selectedApp.orario.length - 1]}`
//                       : selectedApp.orario[0]}
//                   </p>
//                 )}
//               </div>
//             )}
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setSelectedApp(null)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {t('chiudi')}
//               </button>
//             </div>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </>
//   )
// }
'use client'
import React, { useEffect, useId, useState, useCallback } from 'react'
import Select from 'react-select'
import { getAllAppuntamentiByCommerciale } from '@/actions/getAllAppuntamenti'
import { Dialog } from '@headlessui/react'
import useSWR from 'swr'
import { useTranslation } from "@/lib/useTranslation"
import { PiBuildingsLight, PiBriefcaseLight, PiUserLight, PiDeviceMobileLight, PiCalendarDotsLight } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderWidth: '2px',
    borderRadius: '0.75rem',
    padding: '0.25rem 0.5rem',
    borderColor: state.isFocused ? '#e62c33' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 255, 255, 0.5)' : 'none',
    '&:hover': {
      borderColor: '#e62c33',
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'rgba(230, 44, 51, 0)'
      : state.isFocused
      ? 'rgba(230, 44, 51, 0.25)'
      : 'white',
    color: state.isSelected ? 'black' : 'black',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '0.75rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    zIndex: 20,
  }),
}

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

function formatOrario(orario: string[]): string {
  if (!orario || orario.length === 0) return ''
  const start = new Date(orario[0])
  const end = new Date(orario[orario.length - 1])
  end.setMinutes(end.getMinutes() + 30)

  const timeRange = `${start.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })} → ${end.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })}`

  const dateStr = start.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return `${dateStr.charAt(0).toUpperCase()}${dateStr.slice(1)}, ${timeRange}`
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
    label: `${formatOrario(app.orario ?? [])} - ${app.cliente.nome ?? ''} ${app.cliente.cognome ?? ''} - ${app.cliente.azienda} - ${app.cliente.email}`,
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
            className="w-full"
            options={options}
            isLoading={isLoading}
            instanceId={selectInstanceId}
            onChange={handleChange}
            placeholder={t('cercaper')}
            isClearable
            onInputChange={(value) => setInputValue(value)}
            noOptionsMessage={() => t('noresult')}
            styles={customStyles}
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
          {selectedApp.orario && (
            <p className="flex items-center gap-2">
              <PiCalendarDotsLight className="text-primary" />
              <span>{t('orario')}: {formatOrario(selectedApp.orario)}</span>
            </p>
          )}
          <p className="flex items-center gap-2">
            <PiUserLight className="text-primary" />
            <span>{t('nome')}: {selectedApp.cliente.nome} {selectedApp.cliente.cognome}</span>
          </p>
          <p className="flex items-center gap-2">
            <PiBuildingsLight className="text-primary" />
            <span>{t('azienda')}: {selectedApp.cliente.azienda}</span>
          </p>
          <p className="flex items-center gap-2">
            <PiBuildingsLight className="text-primary" />
            <span>{t('ruolo')}: {selectedApp.cliente.ruolo}</span>
          </p>
          <p className="flex items-center gap-2">
            <CiMail className="text-primary" />
            <span>Email: {selectedApp.cliente.email}</span>
          </p>
          {selectedApp.cliente.numero && (
            <p className="flex items-center gap-2">
              <PiDeviceMobileLight className="text-primary" />
              <span>{t('telefono')}: {selectedApp.cliente.numero}</span>
            </p>
          )}
        </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/80"
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
