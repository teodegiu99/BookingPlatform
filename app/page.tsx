// import { Button } from "@/components/ui/button";
// import { Poppins } from "next/font/google";
// import { cn } from "@/lib/utils";
// import { LoginButton } from "@/components/auth/LoginButton";

// const font = Poppins({
//   subsets: ["latin"],
//   weight: ["600"],
// });

// export default function Home() {
//   return (
//     <main className="flex h-full flex-col justify-center items-center ">
//       <div className="space-y-6 text-center">
//         <h1
//           className={cn(
//             "text-5xl font-semibold text-white drop-shadow-md",
//             font.className
//           )}
//         >
//           Accedi
//         </h1>
//         <p className="text-lg text-white"></p>
//         <div>
//           <LoginButton asChild>
//             <Button variant="secondary" size="lg">
//               Accedi
//             </Button>
//           </LoginButton>
//         </div>
//       </div>
//     </main>
//   );
// }
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/auth/login')
}