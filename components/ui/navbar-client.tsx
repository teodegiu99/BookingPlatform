'use client';

import { useState } from 'react';
import Image from 'next/image';
import SignOutButton from '../auth/SignoutBtn';
import LanguageSwitcher from './langSwitch';
import HelpSwitch from './helpSwitch';
import NavSwitch from './navswitch';
import ExternalViewSwitch from './external-view-switch';
import { FiMenu, FiX } from 'react-icons/fi';

interface NavbarClientProps {
  role: string;
  hasExternalAccess: boolean;
}

export default function NavbarClient({ role, hasExternalAccess }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (role !== 'ADMIN' && role !== 'USER' && role !== 'SUSER') {
    return <div className='hidden'></div>;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className='fixed top-0 left-0 right-0 flex w-full h-16 md:h-20 justify-between items-center p-4 bg-neutral shadow-lg overflow-visible z-[100]'>
      
      {/* LEFT SECTION */}
      <div className="flex items-center z-10">
        <div className='hidden md:block'><HelpSwitch /></div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-3xl text-primary mt-1">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* CENTER SECTION (LOGO) */}
      <div className='absolute left-1/2 -translate-x-1/2 flex justify-center items-center z-0'>
        <Image src="/logo-black.svg" width={50} height={50} alt="Logo esteso nero" className="object-contain" />
      </div>

      {/* RIGHT SECTION (DESKTOP) */}
      <div className='hidden md:flex justify-end items-center gap-x-4 z-10'>
        {role === 'SUSER' && <NavSwitch />}
        {hasExternalAccess && <ExternalViewSwitch />}
        <LanguageSwitcher /> 
        <SignOutButton />
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-neutral shadow-xl flex flex-col items-center gap-y-6 py-6 md:hidden border-t z-50">
          <div onClick={toggleMenu}><HelpSwitch isMobile /></div>
          {role === 'SUSER' && <div onClick={toggleMenu}><NavSwitch isMobile /></div>}
          {hasExternalAccess && <div onClick={toggleMenu}><ExternalViewSwitch isMobile /></div>}
          <div onClick={toggleMenu}><LanguageSwitcher isMobile /></div>
          <div onClick={toggleMenu}><SignOutButton isMobile /></div>
        </div>
      )}
    </div>
  );
}
