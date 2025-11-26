import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full pl-35 pr-30 py-7 flex justify-center items-center">
      <div className="flex items-center justify-between w-full"> 
        <div className="flex-shrink-0">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={100} 
            height={38} 
            priority 
          />
        </div>

        <div className="flex gap-10 items-center justify-center mx-auto ml-165">
          <Link href="/" className="text-[#94A5C6] hover:text-[#4F567E] text-lg font-bold">
            Home
          </Link>
          <Link href="/main/events" className="text-[#94A5C6] hover:text-[#4F567E] text-lg font-bold">
            Events
          </Link>
        </div>
        
        <div className="flex space-x-4 items-center justify-center flex-shrink-0"> 
          <Link href="/auth/login" className="bg-[#D4DBE9] px-4 py-2 rounded-xl text-white hover:bg-[#4F567E] text-lg font-bold">
            Login
          </Link>
          <Link href="/auth/register" className="bg-[#6876A8] px-4 py-2 rounded-xl text-white hover:bg-[#4F567E] text-lg font-bold">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}