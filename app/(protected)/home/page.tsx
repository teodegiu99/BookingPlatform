import { CalendarDemo } from "@/components/protected/calendar";
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
	<div>
    <CalendarDemo />
	</div>
  )
}

export default Home