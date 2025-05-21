'use client';

import { DayCalendar } from './dayCalendar';
import useSWR from 'swr';
import { useTranslation } from "@/lib/useTranslation";


export const dynamic = 'force-dynamic'; // 👈 disabilita cache

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CalendarioPage = () => {
  
  const { data, isLoading } = useSWR(`/api/calendario`, fetcher, {
    refreshInterval: 2400, 
  });

 const { t } = useTranslation();
  
  if (isLoading || !data) return <div>{t('caricamento')}</div>;

  return (
    <div className="p-4">
 
      <div className=' items-center mb-4  '>
      <DayCalendar
        commerciali={data.commerciali}
        appuntamenti={data.appuntamenti}
      />
      </div>
    </div>
  );
};

export default CalendarioPage;
