import Footer from "@/components/ui/footer";
import NavBar from "@/components/ui/navbar";

const HomeLayout = ({children}: {children: React.ReactNode}) => {
    return ( 
        <div className="h-screen w-screen justify-center items-center bg-[#f9f9f9] ">
            <NavBar />
          {children}
            <Footer />
                    </div>
     );
}
 
export default HomeLayout;