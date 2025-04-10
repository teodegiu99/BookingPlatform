
// import { auth, signOut } from "@/auth";
// const signoutbtn= async () => {
// 	// const session = await auth();
//   return (
// 	<div>
// 		{/* {JSON.stringify(session)} */}
// 		<form action={async () => {
// 			"use server"
// 			await signOut();
// 		}}>
// 			<button type="submit" className="bg-secondary p-5">
// 				Sign out
// 			</button>
// 		</form>
// 	</div>
//   )
// }

// export default signoutbtn
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
