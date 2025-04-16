'use client'

import { CalendarDemo } from "@/components/protected/calendar"
import NextAppointment from "@/components/protected/NextAppointment"
import TimeSlotList from "@/components/protected/slots"
import { DateProvider } from '@/context/DateContext'
import AppointmentSearch from "@/components/protected/AppointmentSearch"

const Home = async () => {
  return (
    <DateProvider>
      <div className="grid grid-cols-3 xl:grid-cols-6 h-screen w-screen p-5 gap-2">
        {/* Colonna sinistra */}
        <div className="col-span-1 xl:col-span-2  flex flex-col justify-end items-center gap-2 h-[88vh]">
          <div className="w-full">
          <CalendarDemo />
          </div>
          <div className="w-full">
          <NextAppointment />
          </div>
        </div>

        {/* Colonna destra */}
        <div className="col-span-2 xl:col-span-4 flex flex-col justify-end items-center gap-2 h-[88vh]">
          <div className="w-full mb-10">
          <AppointmentSearch onSelect={(app) => console.log('Appuntamento selezionato:', app)} />          </div>
          <div className="w-full">
            <TimeSlotList />
          </div>
        </div>
      </div>
    </DateProvider>
  )
}

export default Home
