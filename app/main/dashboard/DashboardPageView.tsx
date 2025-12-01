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
  BannerFileName: string;
  BannerURL?: string;
}

interface DashboardPageViewProps {
  events: DashboardEvent[];
}

export default function DashboardPageView({ events }: DashboardPageViewProps) {
  const [openModal, setOpenModal] = useState(false);
  const [fileName, setFileName] = useState<File | null>(null);

  // FORM STATES
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setEventName("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setFileName(null);
    if (fileRef.current) fileRef.current.value = "";
    setOpenModal(false);
  };


  // SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jsonData = {
      name: eventName,
      description: description,
      location: location,
      time_start: new Date(startTime).toISOString(),
      time_end: new Date(endTime).toISOString()
    };

    if (isEditing && selectedEvent) {
      // --- UPDATE ---
      const res = await fetch(`http://localhost:8080/events/update/${selectedEvent.ID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(jsonData),
      });

      handleCloseModal();
      window.location.reload();
      return;
    }

    // --- CREATE ---
    const res = await fetch("http://localhost:8080/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(jsonData),
    });

    const data = await res.json();
    if (!data.id) return;

    handleCloseModal();
    window.location.reload();
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

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImagePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.TimeStart).getTime() - new Date(a.TimeStart).getTime();
  });
  
  return (
    <>
      <UserHeader />
      <div className="container mx-auto px-4 mt-10">
        <div className="flex justify-between items-center mb-6">
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
              {sortedEvents && sortedEvents.length > 0 ? (
                  sortedEvents.map((event, index) => (
                  <tr key={event.ID} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-center border-b">{index + 1}</td>
                    <td className="py-4 px-4 text-center font-medium border-b">{event.Name}</td>
                    <td className="py-4 px-4 text-center text-gray-600 border-b max-w-xs truncate">
                      {event.Description}
                    </td>
                    <td className="py-4 px-4 text-center border-b">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {new Date(event.TimeStart).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.TimeStart).toLocaleTimeString([], {
                            minute: "2-digit",
                            hour: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center border-b">{event.Location}</td>
                    <td className="py-4 px-4 text-center border-b">
                      {getEventStatus(event.TimeStart, event.TimeEnd)}
                    </td>
                    <td className="py-4 px-4 text-center border-b">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold mr-2"
                        onClick={() => {
                          setSelectedEvent(event);
                          setEventName(event.Name);
                          setDescription(event.Description);
                          setLocation(event.Location);
                          setStartTime(event.TimeStart);
                          setEndTime(event.TimeEnd);
                          setIsEditing(true);
                          setOpenModal(true);
                        }}
                      >
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 animate-[fadeIn_0.2s_ease] scale-95 transition-all">

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-5 text-gray-800 text-center">
              {isEditing ? "Edit Event" : "Add New Event"}
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                // --- 1) Send JSON first ---
                const jsonData = {
                  name: eventName,
                  description,
                  location,
                  time_start: new Date(startTime).toISOString(),
                  time_end: new Date(endTime).toISOString(),
                  banner_file_name: fileName ? fileName.name : selectedEvent?.BannerFileName || ""
                };

                let res;
                if (isEditing && selectedEvent) {
                  res = await fetch(`http://localhost:8080/events/update/${selectedEvent.ID}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(jsonData),
                  });
                } else {
                  res = await fetch("http://localhost:8080/events/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(jsonData),
                  });
                }

                const data = await res.json();
                const eventId = isEditing ? selectedEvent!.ID : data.id;

                // --- 2) Upload image if a file was selected ---
                if (fileName) {
                  const formData = new FormData();
                  formData.append("file", fileName);

                  await fetch(`http://localhost:8080/events/update/images/${eventId}`, {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                  });
                }

                handleCloseModal();
                window.location.reload();
              }}
              className="space-y-4"
            >

              {/* NAME */}
              <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />

              {/* DESCRIPTION */}
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />

              {/* LOCATION */}
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />

              {/* DATES */}
              <div className="flex gap-3">
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />

                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="block font-medium mb-1">Event Banner</label>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setFileName(file);

                      const previewUrl = URL.createObjectURL(file);
                      setPreviewImage(previewUrl);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 cursor-pointer"
                />

                {/* Preview */}
                {(previewImage ||
                  (selectedEvent?.BannerFileName &&
                    `http://localhost:8080/public/events/banner/${selectedEvent.BannerFileName}`)
                ) && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={
                        previewImage
                          ? previewImage
                          : `http://localhost:8080/public/events/banner/${selectedEvent?.BannerFileName}`
                      }
                      alt="Preview"
                      className="w-full max-h-60 object-cover rounded-xl shadow-md border"
                    />
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
              >
                {isEditing ? "Save Changes" : "Create Event"}
              </button>

              {/* DELETE */}
              {isEditing && (
                <button
                  type="button"
                  onClick={async () => {
                    await fetch(`http://localhost:8080/events/update/${selectedEvent!.ID}`, {
                      method: "DELETE",
                      credentials: "include",
                    });
                    handleCloseModal();
                    window.location.reload();
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white mt-2 py-3 rounded-xl font-semibold transition"
                >
                  Delete Event
                </button>
              )}

              {/* CANCEL */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 mt-2 py-3 rounded-xl transition"
              >
                Cancel
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
