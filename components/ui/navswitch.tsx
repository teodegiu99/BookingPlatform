'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavSwitch() {
  const pathname = usePathname()

  return pathname.includes('/dashboard') ? (
    <div className='m-x-8 bg-primary p-2 rounded-[8px]'>
    <Link href="/calendar" className="text-white font-thin text-sm">
      Calendar
    </Link>
    </div>
  ) : (
    <div className='m-x-8 bg-primary p-2 rounded-[8px]'>
    <Link href="/dashboard" className="text-white font-thin text-sm">
      Dashboard
    </Link>
    </div>
  )
}
