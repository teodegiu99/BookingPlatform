'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavSwitch() {
  const pathname = usePathname()

  return pathname.includes('/dashboard') ? (
    <Link href="/calendar" className="text-black font-thin text-sm">
      Calendar
    </Link>
  ) : (
    <Link href="/dashboard" className="text-black font-thin text-sm">
      Dashboard
    </Link>
  )
}
