'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function UserHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.refresh(); 
        
        // Redirect to home
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
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
          <Link href="/main/bookedEvents" className="text-[#94A5C6] hover:text-[#4F567E] text-lg font-bold">
            Booked Events
          </Link>
          <Link href="/main/dashboard" className="text-[#94A5C6] hover:text-[#4F567E] text-lg font-bold">
            Dashboard
          </Link>
        </div>
        
        <div className="flex space-x-4 items-center justify-center shrink-0"> 
          <button 
            onClick={handleLogout}
            className="bg-[#6876A8] px-4 py-2 rounded-xl text-white hover:bg-[#4F567E] text-lg font-bold cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}