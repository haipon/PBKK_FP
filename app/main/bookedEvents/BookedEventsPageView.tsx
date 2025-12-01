'use client';

import { useEffect, useState } from "react";
import UserHeader from "../../component/userHeader"

interface BookedEvent {
  ID: number;
  Name: string;
  Description: string;
  TimeStart: string;
  TimeEnd: string;
  Location: string;
}

interface BookedEventsPageViewProps {
  events: BookedEvent[];
}


export default function BookedEventsPageView() {
  const [events, setEvents] = useState<BookedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const res = await fetch("http://localhost:8080/events/booked", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setEvents(data.events); // IMPORTANT: match your backend JSON
      }
      setLoading(false);
    };

    loadEvents();
  }, []);

  const getEventStatus = (startStr: string, endStr: string) => {
    const now = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (now < start) return <span className="badge bg-blue-100 text-blue-800">Upcoming</span>;
    if (now <= end) return <span className="badge bg-green-100 text-green-800">Running</span>;
    return <span className="badge bg-gray-100 text-gray-600">Ended</span>;
  };
  
  return (
    <>
      <UserHeader />
      <div className = "container mx-auto px-4 mt-10">
        <h1 className="text-3xl font-bold mb-6 text-left">Your booked events!</h1>
        <div className="overflow-x-auto shadow-lg border border-gray-300 rounded-lg">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-4 px-4 text-center">No.</th>
                  <th className="py-4 px-4 text-center">Name</th>
                  <th className="py-4 px-4 text-center">Description</th>
                  <th className="py-4 px-4 text-center">Date</th>
                  <th className="py-4 px-4 text-center">Location</th>
                  <th className="py-4 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {events && events.length > 0 ? (
                  events.map((event, index) => (
                    <tr key={event.ID} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-center border-b">{index + 1}</td>
                      <td className="py-4 px-4 font-medium border-b">{event.Name}</td>
                      <td className="py-4 px-4 text-gray-600 border-b max-w-xs truncate">
                        {event.Description}
                      </td>
                      <td className="py-4 px-4 text-center border-b">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(event.TimeStart).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {/* Shows e.g., "08:30 PM" */}
                            {new Date(event.TimeStart).toLocaleTimeString([], {
                              minute: '2-digit',
                              hour: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center border-b">{event.Location}</td>
                      <td className="py-4 px-4 text-center border-b">
                        {getEventStatus(event.TimeStart, event.TimeEnd)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      You haven't booked any events yet.
                      <br />
                      <a href="/main/events" className="text-blue-500 hover:underline mt-2 inline-block">
                        Browse events to join?
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    </>
  );
}
