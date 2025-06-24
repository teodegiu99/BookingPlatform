'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Help from './help';
import Helpcom from './helpcom';

export default function NavSwitch() {
  const pathname = usePathname()

  return pathname.includes('/dashboard') ? (
<Help />
  ) : (
   <Helpcom />
  )
}
