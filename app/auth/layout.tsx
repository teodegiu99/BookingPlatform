const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return ( 
        <div className="h-screen flex items-center justify-center bg-[url('/BG.png')] bg-cover bg-center">
            {children}
        </div>
     );
}
 
export default AuthLayout;