import React from 'react'
import { CalendarDemo } from "@/components/protected/calendar"
import NextAppointment from "@/components/protected/NextAppointment"
import TimeSlotList from "@/components/protected/slots"
import { DateProvider } from '@/context/DateContext'
import AppointmentSearch from "@/components/protected/AppointmentSearch"
import { auth, signOut } from "@/auth";


const Calendar = async () => {
  const session = await auth();
  return (
<DateProvider>
        <div className="w-full h-full flex justify-center items-center">
        <div className="grid grid-cols-3 xl:grid-cols-6 xl:gap-x-8 max-w-[1280px] p-8 gap-x-4">
          {/* Colonna sinistra */}
          <div className="col-span-1 xl:col-span-2 ">
            <div className="mb-8">
              <CalendarDemo />
            </div>
            <div className="">
              <NextAppointment userId={session!.user.id!} />
            </div>
          </div>

          {/* Colonna destra */}
          <div className="col-span-2 xl:col-span-4 ">
            <div className="mb-8">
              <AppointmentSearch />
            </div>
            <div className="">
            
              <TimeSlotList userId={session!.user.id!} />            
            </div>
          </div>
        </div>
       
        </div>
      </DateProvider>  )
}

export default Calendar