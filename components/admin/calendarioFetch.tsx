'use client';

import { DayCalendar } from './dayCalendar';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CalendarioPage = () => {

  const { data, isLoading } = useSWR(`/api/calendario`, fetcher, {
    refreshInterval: 1000 * 60 * 0.04, // ogni 5 minuti
  });

  
  if (isLoading || !data) return <div>Caricamento...</div>;

  return (
    <div className="p-4">
 
      <div className=' items-center mb-4 mt-12 '>
      <DayCalendar
        commerciali={data.commerciali}
        appuntamenti={data.appuntamenti}
      />
      </div>
    </div>
  );
};

export default CalendarioPage;
