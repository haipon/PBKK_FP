import Image from "next/image";
import Link from "next/link";

export default function UserHeader() {
  return (
    <header className="w-full pl-35 pr-30 py-7 flex justify-center items-center">
      <div className="flex items-center justify-between w-full"> 
        <div className="shrink-0">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={100} 
            height={38} 
            priority 
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex gap-10 items-center">
          <Link href="/" className="text-[#94A5C6] hover:text-[#4F567E] text-lg font-bold">
            Home
          </Link>
          <Link href="/main/events" className="text-[#94A5C6] hover:text-[#4F567E] text-lg font-bold">
            Events
          </Link>
          <Link href="/main/myEvents" className="text-[#94A5C6] hover:text-[#4F567E] text-lg font-bold">
            My Events
          </Link>
          <Link href="/main/dashboard" className="text-[#94A5C6] hover:text-[#4F567E] text-lg font-bold">
            Dashboard
          </Link>
        </div>
        
        <div className="flex space-x-4 items-center justify-center shrink-0"> 
          <Link href="/" className="bg-[#6876A8] px-4 py-2 rounded-xl text-white hover:bg-[#4F567E] text-lg font-bold">
            Log out
          </Link>
        </div>
      </div>
    </header>
  );
}