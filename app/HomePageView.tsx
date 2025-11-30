'use client';

import Image from "next/image";
import Link from "next/link";
import Header from "./component/header";
import UserHeader from "./component/userHeader";

interface HomeClientViewProps {
  isAuthenticated: boolean;
}

export default function HomeClientView({ isAuthenticated }: HomeClientViewProps) {
  return (
    <>
      {isAuthenticated ? <UserHeader /> : <Header />}

      {/* Main Wrapper */}
      <div className="w-full flex justify-center px-6 mt-8">
        <div
          className="w-full bg-white rounded-3xl p-12 shadow-sm border relative"
          style={{
            maxWidth: "1500px",
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            {/* LEFT TEXT SECTION */}
            <div>
              <h1 className="text-7xl font-semibold leading-snug">
                <span className="text-[#7685b6] font-bold italic">Create. Join. </span>
                <span className="text-[#7685b6] font-bold italic">Manage. </span>
                <span>All in one place.</span>
              </h1>

              <Link href="/main/events">
                <button className="mt-8 px-6 py-3 bg-[#e7ecf8] rounded-xl text-black font-bold shadow hover:bg-[#d8e0f5] transition flex items-center gap-2 cursor-pointer">
                  Browse Events <span>→</span>
                </button>
              </Link>
            </div>

            {/* RIGHT IMAGE SECTION */}
            <div className="flex justify-center">
              <Image
                src="/images/homepage.jpg"
                alt="Homepage hero image"
                width={420}
                height={300}
                className="rounded-md object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}