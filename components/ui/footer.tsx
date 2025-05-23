import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
const Footer = () => {
  return (
    <div className='w-screen bg-neutral min-h-5 flex justify-between items-center'>
<Link   href="/" className='text-xs font-extralight px-8'>Privacy policy</Link>
<Image src="/logo-black.svg"
               width={40}
               height={40}
               alt="Logo esteso nero"
               className="object-contain py-1"
               />     
<Link   href="/" className='text-xs font-extralight px-8'>Cookies policy</Link>
    </div>
  )
}

export default Footer