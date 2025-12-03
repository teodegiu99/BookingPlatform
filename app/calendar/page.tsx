import React from 'react'
import { CalendarDemo } from "@/components/protected/calendar"
import NextAppointment from "@/components/protected/NextAppointment"
import TimeSlotList from "@/components/protected/slots"
import { DateProvider } from '@/context/DateContext'
import AppointmentSearch from "@/components/protected/AppointmentSearch"
import { auth } from "@/auth";
import { ClientBanner } from '@/components/ui/clientbanner'

// Aggiungi props per leggere i parametri URL
const Calendar = async ({ searchParams }: { searchParams: { view?: string } }) => {
  const session = await auth();
  
  // Logica per decidere CHI stiamo guardando:
  // 1. Se c'è ?view=external nell'URL
  // 2. E l'utente ha un 'estxcomm' settato
  // Allora usiamo l'ID di estxcomm. Altrimenti il tuo.
  const isExternalView = searchParams?.view === 'external';
  
  const targetUserId = (isExternalView && session?.user.estxcomm) 
    ? session.user.estxcomm 
    : session?.user.id;

  if (!targetUserId) return <div>Errore: Utente non trovato</div>;

  return (
    <DateProvider>
      <div className="w-full h-full flex justify-center items-center pt-16">
        
        {/* Banner informativo (Opzionale) */}
        {isExternalView && (
          <div className="absolute top-20 z-50 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">
            <ClientBanner />
          </div>
        )}

        <div className="grid grid-cols-3 xl:grid-cols-6 xl:gap-x-8 max-w-[1280px] p-8 gap-x-4">
          {/* Colonna sinistra */}
          <div className="col-span-1 xl:col-span-2 ">
            <div className="mb-8">
              {/* Passiamo targetUserId per vedere i pallini rossi GIUSTI */}
              <CalendarDemo userId={targetUserId} />
            </div>
            <div className="">
              <NextAppointment userId={targetUserId} />
            </div>
          </div>

          {/* Colonna destra */}
          <div className="col-span-2 xl:col-span-4 ">
            <div className="mb-8">
              {/* La ricerca cercherà tra gli appuntamenti del targetUserId */}
              <AppointmentSearch targetUserId={targetUserId} />
            </div>
            <div className="">
              {/* La lista mostrerà gli slot del targetUserId */}
              <TimeSlotList userId={targetUserId} />            
            </div>
          </div>
        </div>
      </div>
    </DateProvider>
  )
}

export default Calendar