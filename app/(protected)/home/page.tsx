
import { CalendarDemo } from "@/components/protected/calendar"
import NextAppointment from "@/components/protected/NextAppointment"
import TimeSlotList from "@/components/protected/slots"
import { DateProvider } from '@/context/DateContext'
import AppointmentSearch from "@/components/protected/AppointmentSearch"
import { auth, signOut } from "@/auth";
import DashboardPage from "@/app/dashboard/page"
import Calendar from "@/app/calendar/page"
const Home = async () => {
  const session = await auth();

  if (session?.user.role === 'ADMIN') {
    return (
    <DashboardPage />
    )
  } else {
    return (
      <Calendar />
    );
  }
};

export default Home;
