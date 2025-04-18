// app/(dashboard)/calendario/page.tsx
import { db } from '@/lib/db';
import { DayCalendar } from './dayCalendar';

const CalendarioPage = async () => {
  const commerciali = await db.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

    const appuntamenti = await db.appuntamento.findMany({
        include: {
          cliente: true,       // <- include i dati del cliente
          commerciale: true,   // <- include i dati del commerciale
        },
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Calendario Giornaliero</h1>
      <DayCalendar commerciali={commerciali} appuntamenti={appuntamenti} />
    </div>
  );
};

export default CalendarioPage;
