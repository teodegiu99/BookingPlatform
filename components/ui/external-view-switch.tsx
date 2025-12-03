'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { PiUserSwitchLight } from "react-icons/pi";
import { useTranslation } from "@/lib/useTranslation";

export default function ExternalViewSwitch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  
  const isExternalView = searchParams.get('view') === 'external';

  const toggleView = () => {
    if (isExternalView) {
      router.push('/calendar');
    } else {
      router.push('/calendar?view=external');
    }
  };

  return (
    <button 
      onClick={toggleView} 
      className='bg-primary p-2 rounded-[8px] flex items-center gap-x-2 hover:bg-primary/90 transition-colors'
    >
      <PiUserSwitchLight className="text-white text-lg" />
      <span className="text-white font-thin text-sm">
        {isExternalView ? t('mio_calendario') : t('altro_calendario')}
      </span>
    </button>
  );
};