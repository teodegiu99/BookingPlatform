'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Help from './help';
import Helpcom from './helpcom';

export default function HelpSwitch({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname()

  return pathname.includes('/dashboard') ? (
    <Help isMobile={isMobile} />
  ) : (
    <Helpcom isMobile={isMobile} />
  )
}
