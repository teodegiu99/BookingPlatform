import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
    <Image src="/logo-black.svg"
      width={150}
      height={150}
      alt="Sfondo aziendale"
      />
      <p className="text-muted-foreground text-small">{label}</p>
    </div>
  );
};
