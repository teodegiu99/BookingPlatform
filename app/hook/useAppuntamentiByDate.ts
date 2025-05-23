'use client'

import useSWR from 'swr'

export const useAppuntamentiByDate = () => {
  const fetcher = async () => {
    const res = await fetch('/api/appuntamenti')
    if (!res.ok) throw new Error('Errore nel fetch degli appuntamenti')
    return res.json()
  }

  const { data: appuntamenti = [], error } = useSWR('/api/appuntamenti', fetcher, {
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

  console.log("appuntamentiDays:", appuntamentiDays)
  return { appuntamentiDays, error }
}
