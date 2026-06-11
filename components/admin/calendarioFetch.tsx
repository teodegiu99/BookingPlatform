'use client';

import { DayCalendar } from './dayCalendar';
import useSWR from 'swr';
import { useTranslation } from "@/lib/useTranslation";


export const dynamic = 'force-dynamic'; // 👈 disabilita cache

import { useSession } from 'next-auth/react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CalendarioPage = () => {
  const { data: session } = useSession();
  
  const { data, isLoading } = useSWR(`/api/calendario`, fetcher, {
    refreshInterval: 2400, 
  });

 const { t } = useTranslation();
  
  if (isLoading || !data) return <div>{t('caricamento')}</div>;

  let commercialiSorted = data.commerciali || [];
  if (session?.user?.id) {
    commercialiSorted = [...commercialiSorted].sort((a: any, b: any) => {
      if (a.id === session.user.id) return -1;
      if (b.id === session.user.id) return 1;
      return 0;
    });
  }

  return (
    <div className="p-4">
 
      <div className=' items-center mb-4  '>
      <DayCalendar
        commerciali={commercialiSorted}
        appuntamenti={data.appuntamenti}
      />
      </div>
    </div>
  );
};

export default CalendarioPage;
