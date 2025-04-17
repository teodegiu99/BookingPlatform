import React from 'react'
import { auth, signOut } from "@/auth";
import Image from 'next/image';
import SignOutButton from '../auth/SignoutBtn';

const NavBar  =  async () => {
  const session = await auth();
  console.log(session)
  JSON.stringify(session)
  return (
    <div className='absolute flex w-screen h-[7%] justify-between items-center p-2 bg-neutral shadow-lg overflow-hidden'>
      ciao {session?.user.name}
      <div className='p-1'></div>
      <div className='flex justify-center items-center'>
        <Image src="/logo-black.svg"
             width={50}
             height={50}
             alt="Logo esteso nero"
             className="object-contain"
             />
             </div>
        <SignOutButton />
    </div>
  )
}

export default NavBar