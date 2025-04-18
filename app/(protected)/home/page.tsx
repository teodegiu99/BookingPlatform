
import { CalendarDemo } from "@/components/protected/calendar"
import NextAppointment from "@/components/protected/NextAppointment"
import TimeSlotList from "@/components/protected/slots"
import { DateProvider } from '@/context/DateContext'
import AppointmentSearch from "@/components/protected/AppointmentSearch"
import { auth, signOut } from "@/auth";
import CalendarioPage from "@/components/admin/calendarioFetch"

const Home = async () => {

  const session = await auth();

if (session?.user.role === 'ADMIN'){
  return (
  //  <div className="text-8xl">
  //   SONO ADMIN
  //  </div>
<CalendarioPage />
)
}
else
{
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
          <div className="flex w-full">
          <AppointmentSearch />      
                </div>
          <div className="flex w-full ">
            <TimeSlotList />
          </div>
        </div>
      </div>
    </DateProvider>
  )
}
}
export default Home
