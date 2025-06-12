
import Image from 'next/image';
import SignOutButton from '../auth/SignoutBtn';
import Help from './help';
import Helpcom from './helpcom';
import LanguageSwitcher from './langSwitch';
import { auth, signOut } from "@/auth";
import Link from 'next/link';
import { headers } from 'next/headers';
import { usePathname } from 'next/navigation'
import NavSwitch from './navswitch';

const NavBar = async () => {
  const session = await auth();
  if (session?.user.role === 'ADMIN') {

  return (
    <div className='absolute flex w-screen h-[7%] justify-between items-center p-2 bg-neutral shadow-lg overflow-hidden'>
      <div className='p-4'><Help /></div>
      
      <div className='flex justify-center items-center'>
        <Image src="/logo-black.svg"
             width={50}
             height={50}
             alt="Logo esteso nero"
             className="object-contain"
             />
      </div>
      <div className='flex justify-center items-center'>
      <LanguageSwitcher /> 
      <SignOutButton />
      </div>
    </div>
   
  )}else if (session?.user.role === 'USER'){
    return (
      <div className='absolute flex w-screen h-[7%] justify-between items-center p-2 bg-neutral shadow-lg overflow-hidden'>
        <div className='p-4'><Helpcom /></div>
        
        <div className='flex justify-center items-center'>
          <Image src="/logo-black.svg"
               width={50}
               height={50}
               alt="Logo esteso nero"
               className="object-contain"
               />
        </div>
        <div className='flex justify-center items-center'>
        <LanguageSwitcher /> 
        <SignOutButton />
        </div>
      </div>
  )}else if (session?.user.role === 'SUSER'){
    return (
      <div className='absolute flex w-screen h-[7%] justify-between items-center p-2 bg-neutral shadow-lg overflow-hidden'>
        <div className='p-4'><Help /></div>
        
        <div className='flex justify-center items-center'>
          <Image src="/logo-black.svg"
               width={50}
               height={50}
               alt="Logo esteso nero"
               className="object-contain"
               />
        </div>
        <div className='flex justify-center items-center gap-x-4'>
        <NavSwitch />
          <LanguageSwitcher /> 
        <SignOutButton />
        </div>
      </div>
  )
  } else {  
    return (
      <div className='hidden'></div>
    )

  }
}

export default NavBar;
