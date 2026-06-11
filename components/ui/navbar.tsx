import { auth } from "@/auth";
import NavbarClient from './navbar-client';

const NavBar = async () => {
  const session = await auth();

  if (process.env.MANUTENZIONE === '1' && session?.user?.role !== 'ADMIN') {
    return null;
  }

  // Recupera il campo estxcomm dalla sessione
  const hasExternalAccess = !!session?.user?.estxcomm;
  const role = session?.user?.role;

  if (!role) {  
    return <div className='hidden'></div>;
  }

  return <NavbarClient role={role} hasExternalAccess={hasExternalAccess} />;
}

export default NavBar;