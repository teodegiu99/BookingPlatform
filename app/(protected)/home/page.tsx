import { CalendarDemo } from "@/components/protected/calendar";
import NextAppointment from "@/components/protected/NextAppointment";
import TimeSlotList from "@/components/protected/slots";
import { DateProvider } from '@/context/DateContext'



const Home= async () => {
  return (
    <DateProvider>
	<div className="grid xl:grid-cols-6 grid-cols-3 h-full w-screen justify-center items-center p-5">
    <div className="flex col-span-1 xl:col-span-2 justify-center items-center h-4/6">    
      <CalendarDemo />
    </div>
    <div className="flex col-span-2 xl:col-span-4 h-4/6 items-center">
    <div
    className='flex flex-col items-center justify-center w-full'>
    <NextAppointment />
    <TimeSlotList />
    </div>
    </div>
	</div>
  </DateProvider>
  )
}

export default Home