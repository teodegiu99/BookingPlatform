
'use client'
import { signOut } from "next-auth/react";
import { PiSignOut } from "react-icons/pi";
import { useTranslation } from "@/lib/useTranslation";

export default function SignOutButton({ isMobile }: { isMobile?: boolean }) {
        const { t } = useTranslation();
  
  if (isMobile) {
    return (
      <button onClick={() => signOut()} className="text-lg font-medium text-red-600">
        {t('disconnetti')}
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut()}
      className= "px-3 flex flex-col items-center gap-[2px] justify-center object-contain"
    >
	<PiSignOut className="text-3xl text-primary" />
	<span className="text-[8px] text-semibold">{t('disconnetti')}</span>
    </button>
  );
}
