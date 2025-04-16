'use client'

import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { getAllAppuntamenti } from '@/actions/getAllAppuntamenti'

type Appuntamento = {
  id: string
  cliente: {
    nome: string | null
    cognome: string | null
    email: string
    azienda: string
  }
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

  const formatOption = (app: Appuntamento): Option => ({
    value: app.id,
    label: `${app.cliente.nome ?? ''} ${app.cliente.cognome ?? ''} - ${app.cliente.azienda} - ${app.cliente.email}`,
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
    if (selected) onSelect(selected.appuntamento)
  }

  return (
    <div className=" max-w-xl">
      <Select
        options={options}
        isLoading={loading}
        onChange={handleChange}
        placeholder="Cerca appuntamento per nome, cognome, azienda o email..."
        isClearable
        onInputChange={(value) => setInputValue(value)}
        noOptionsMessage={() => 'Nessun risultato trovato'}
      />
    </div>
  )
}
