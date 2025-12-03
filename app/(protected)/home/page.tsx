import { auth } from "@/auth";
import DashboardPage from "@/app/dashboard/page"
import Calendar from "@/app/calendar/page"

// Definiamo il tipo per i searchParams che ci aspettiamo
type Props = {
  searchParams: { view?: string };
};

const Home = async ({ searchParams }: Props) => {
  const session = await auth();

  if (session?.user.role === 'ADMIN') {
    return (
      <DashboardPage />
    )
  } else {
    return (
      // Passiamo i searchParams ricevuti dalla Home al Calendar
      <Calendar searchParams={searchParams} />
    );
  }
};

export default Home;