'use client'

import useSWR from 'swr'

// Accetta userId opzionale
export const useAppuntamentiByDate = (userId?: string) => {
  const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Errore nel fetch degli appuntamenti')
    return res.json()
  }

  // Costruisci l'URL dinamico. Se c'è userId, lo aggiunge alla query.
  const url = userId 
    ? `/api/appuntamenti?userId=${userId}` 
    : '/api/appuntamenti';

  // Usa l'URL come chiave SWR (così ricarica se cambia l'URL)
  const { data: appuntamenti = [], error } = useSWR(url, fetcher, {
    refreshInterval: 10000,
  })  

  const dateSet = new Set<string>()

  appuntamenti.forEach((app: any) => {
    if (Array.isArray(app.orario)) {
      app.orario.forEach((o: string) => {
        const date = new Date(o)
        const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
        dateSet.add(key)
      })
    }
  })

  const appuntamentiDays = Array.from(dateSet).map(d => {
    const [year, month, day] = d.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    date.setHours(0, 0, 0, 0)
    return date
  })

  return { appuntamentiDays, error }
}