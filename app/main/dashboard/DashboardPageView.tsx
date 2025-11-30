'use client';

import { useEffect, useState, useRef  } from "react";
import UserHeader from "../../component/userHeader"

interface DashboardEvent {
  ID: number;
  Name: string;
  Description: string;
  TimeStart: string;
  TimeEnd: string;
  Location: string;
}

interface DashboardPageViewProps {
  events: DashboardEvent[];
}

export default function DashboardPageView({ events }: DashboardPageViewProps) {
  const [openModal, setOpenModal] = useState(false);
  const [fileName, setFileName] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleCloseModal = () => {
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
    setOpenModal(false);
  };


  const getEventStatus = (startStr: string, endStr: string) => {
    const now = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (now < start) {
      return (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
          Upcoming
        </span>
      );
    } else if (now >= start && now <= end) {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
          Running
        </span>
      );
    } else {
      return (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
          Ended
        </span>
      );
    }
  };
  
  return (
    <>
      <UserHeader />
      <div className = "container mx-auto px-4 mt-10">
        <div className = "flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome back, User!</h1>
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 bg-[#d6deed] text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#c8d4eb] transition border border-[#b3bfd8]"
            >
              Add an Event
              <span className="text-xl leading-none">+</span>
            </button>
        </div>
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
                  <th className="py-4 px-4 text-center">Actions</th>
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
                      <td className="py-4 px-4 text-center border-b">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold mr-2">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500">
                      You haven't created any events yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    {openModal && (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white w-full max-w-3xl rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add New Event</h2>

          {/* FORM START */}
          <form className="space-y-4">
              <label htmlFor="eventName" className="block text-gray-700 font-bold mb-1">
                Event Name
              </label>
              <input
                type="text"
                placeholder="Event Name"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <label htmlFor="description" className="block text-gray-700 font-bold mb-1">
                Description
              </label>
              <textarea
                placeholder="Description"
                className="w-full border px-3 py-2 rounded-lg"
              />
              
              <label htmlFor="startTime" className="block text-gray-700 font-bold mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <label htmlFor="endTime" className="block text-gray-700 font-bold mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <label htmlFor="location" className="block text-gray-700 font-bold mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Location"
                className="w-full border px-3 py-2 rounded-lg"
              />
              <label htmlFor="imageUpload" className="block text-gray-700 font-bold mb-1">
                Event Upload
              </label>
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer 
                hover:bg-gray-100 transition"
              >
                <span className="text-gray-600">
                  {fileName ? fileName : "Click to upload image"}
                </span>
              </label>

              <input
                ref={fileRef}
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFileName(e.target.files[0].name);
                  }
                }}
              />

              <button
                type="submit"
                className="bg-[#4F567E] text-white w-full py-2 rounded-lg hover:bg-[#3b4461]"
              >
                Save Event
              </button>
          </form>
          {/* FORM END */}

          <button
            onClick={() => setOpenModal(false)}
            className="mt-4 text-gray-500 hover:text-gray-700 w-full text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
    </>
  );
}
