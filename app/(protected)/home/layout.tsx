import NavBar from "@/components/protected/navbar";

const HomeLayout = ({children}: {children: React.ReactNode}) => {
    return ( 
        <div className="h-screen w-screen bg-[#f9f9f9]">
            <NavBar />
            {children}
        </div>
     );
}
 
export default HomeLayout;