
'use client'
import { signOut } from "next-auth/react";
import { PiSignOut } from "react-icons/pi";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className= "px-3 flex flex-col items-center gap-[2px] justify-center object-contain"
    >
	<PiSignOut className="text-3xl text-primary" />
	<span className="text-[8px]">Disconnetti</span>
    </button>
  );
}
