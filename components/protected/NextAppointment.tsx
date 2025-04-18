'use client'

import React from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

// Serve un endpoint API per usare SWR — lo creiamo dopo se non esiste
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function NextAppointment() {
  const { data: session } = useSession()

  const { data: all, isLoading } = useSWR(
    session?.user?.id ? `/api/appuntamenti` : null,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="animate-spin h-4 w-4" />
        Caricamento prossimo appuntamento...
      </div>
    )
  }

  if (!all || all.length === 0) {
    return <div className="text-sm text-muted-foreground">Nessun appuntamento futuro trovato.</div>
  }

  const future = all
    .filter((app: any) => new Date(app.orario[0]) > new Date())
    .sort((a: any, b: any) => new Date(a.orario[0]).getTime() - new Date(b.orario[0]).getTime())

  const nextApp = future[0]

  if (!nextApp) {
    return <div className="text-sm text-muted-foreground">Nessun appuntamento futuro trovato.</div>
  }

  const start = new Date(nextApp.orario[0])
  const end = new Date(nextApp.orario[nextApp.orario.length - 1])
  end.setMinutes(end.getMinutes() + 30)

  const timeRange = `${start.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${end.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })}`

  const dateStr = start.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const cliente = nextApp.cliente

  return (
    <div className="border rounded-xl p-5 shadow-md w-full">
      <h2 className="text-lg font-bold mb-2">Prossimo appuntamento: {dateStr} {timeRange}</h2>
      <div className="text-sm space-y-1">
        <p><strong>{cliente.nome} {cliente.cognome}</strong></p>
        <p>{cliente.azienda} {cliente.ruolo}</p>
      </div>
    </div>
  )
}
