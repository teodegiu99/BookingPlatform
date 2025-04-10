import { CalendarDemo } from "@/components/protected/calendar";
import TimeSlotList from "@/components/protected/slots";

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
	<div className="grid grid-cols-5 h-full w-screen justify-center items-center ">
    <div className="col-span-2 justify-center items-center">    
      <CalendarDemo />
    </div>
    <div>
    <TimeSlotList />

    </div>
	</div>
  )
}

export default Home