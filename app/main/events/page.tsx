"use client";

import { useEffect, useState } from "react";
import Header from "../../component/header";
import UserHeader from "../../component/userHeader";

export default function EventsPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {authenticated ? <UserHeader /> : <Header />}

      {/* Banner */}
      <div className="w-full flex justify-center mt-6">
        <div className="w-[90%] max-w-5xl rounded-3xl overflow-hidden relative">
          <img
            src="/images/homepage.jpg"
            alt="Events Banner"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-semibold">Look Forward to these Events!</h2>
            <p className="text-sm mt-2">
              Find out the current events that are available near you and the upcoming events
            </p>
          </div>
        </div>
      </div>

      {/* Events Near You */}
      <section className="w-[90%] max-w-6xl mx-auto mt-10">
        <h3 className="text-xl font-semibold mb-4">Events Near You</h3>

        <div className="h-40 bg-[#D4DBE9] rounded-xl flex items-center justify-center text-black text-lg font-bold shadow-md">
          Coming Soon
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="w-[90%] max-w-6xl mx-auto mt-14 mb-20">
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>

        <div className="h-40 bg-[#D4DBE9] rounded-xl flex items-center justify-center text-black text-lg font-bold shadow-md">
          Coming Soon
        </div>
      </section>
    </div>
  );
}
