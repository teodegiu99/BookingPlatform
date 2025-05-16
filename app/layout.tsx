import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import "./globals.css";
import { Providers } from './Provider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // scegli i pesi che ti servono
  variable: '--font-poppins', // nome della CSS variable opzionale
  display: 'swap',
})
export const metadata: Metadata = {
  title: "ZBLB Calendar",
  description: "Calendar for ZBLB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

	
  return (
    <html lang="en">
                  

      <body className={poppins.className}><Providers>{children} </Providers></body>

    </html>
  );
}
