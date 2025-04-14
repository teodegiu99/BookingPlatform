import { CalendarDemo } from "@/components/protected/calendar";
import TimeSlotList from "@/components/protected/slots";
import { DateProvider } from '@/context/DateContext'

// const Home= async () => {
// 	const session = await auth();
//   return (
// 	<div>
// 		{JSON.stringify(session)}
// 		<form action={async () => {
// 			"use server"
// 			await signOut();
// 		}}>
// 			<button type="submit">
// 				Sign out
// 			</button>
// 		</form>
// 	</div>
//   )
// }

// export default Home


const Home= async () => {
  return (
    <DateProvider>
	<div className="grid xl:grid-cols-5 grid-cols-3 h-full w-screen justify-center items-center ">
    <div className="col-span-1 xl:col-span-2 justify-center items-center h-4/6">    
      <CalendarDemo />
    </div>
    <div className="col-span-2 xl:col-span-3">
    <TimeSlotList />
    </div>
	</div>
  </DateProvider>
  )
}

export default Home