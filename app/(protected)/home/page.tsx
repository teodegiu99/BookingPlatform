
import { CalendarDemo } from "@/components/protected/calendar"
import NextAppointment from "@/components/protected/NextAppointment"
import TimeSlotList from "@/components/protected/slots"
import { DateProvider } from '@/context/DateContext'
import AppointmentSearch from "@/components/protected/AppointmentSearch"
import { auth, signOut } from "@/auth";
import CalendarioPage from "@/components/admin/calendarioFetch"

const Home = async () => {
  const session = await auth();

  if (session?.user.role === 'ADMIN') {
    return <CalendarioPage />;
  } else {
    return (
      <DateProvider>
        <div className="w-screen h-screen  flex justify-center items-center">
        <div className="grid grid-cols-3 xl:grid-cols-6 gap-2 p-5 max-h-[85vh] lg:max-h-[10vh]">
          {/* Colonna sinistra */}
          <div className="col-span-1 xl:col-span-2 flex flex-col justify-between ">
            <div className="flex-grow">
              <CalendarDemo />
            </div>
            <div className="flex-grow">
              <NextAppointment />
            </div>
          </div>

          {/* Colonna destra */}
          <div className="col-span-2 xl:col-span-4 flex flex-col justify-between">
            <div className="flex-grow">
              <AppointmentSearch />
            </div>
            <div className="flex-grow">
              <TimeSlotList />
            </div>
          </div>
        </div>
        </div>
      </DateProvider>
    );
  }
};

export default Home;
