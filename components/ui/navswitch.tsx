'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useTranslation } from "@/lib/useTranslation"

export default function NavSwitch({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname()
  const { t } = useTranslation()

  if (isMobile) {
    return pathname.includes('/dashboard') ? (
      <Link href="/calendar" className="text-lg font-medium text-gray-800">
        {t('calendario')}
      </Link>
    ) : (
      <Link href="/dashboard" className="text-lg font-medium text-gray-800">
        {t('dashboard')}
      </Link>
    )
  }

  return pathname.includes('/dashboard') ? (
    <div className='m-x-8 bg-primary p-2 rounded-[8px]'>
    <Link href="/calendar" className="text-white font-thin text-sm">
      {t('calendario')}
    </Link>
    </div>
  ) : (
    <div className='m-x-8 bg-primary p-2 rounded-[8px]'>
    <Link href="/dashboard" className="text-white font-thin text-sm">
      {t('dashboard')}
    </Link>
    </div>
  )
}
