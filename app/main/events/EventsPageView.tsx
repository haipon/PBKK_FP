"use client";

import { useEffect, useState } from "react";
import Header from "../../component/header";
import UserHeader from "../../component/userHeader";

interface Event {
  ID: number;
  Name: string;
  Description: string;
  Location: string;
  BannerFileName: string;
  TimeStart: string; // We'll use this to derive the display date
  TimeEnd: string;
  UserID: number;
}

interface EventsPageViewProps {
  events: Event[];
  isAuthenticated: boolean;
  currentUserId?: number; 
}

// Helper function to format the date string (e.g., "January 1, 2026")
const formatDate = (timeStart: string): string => {
    try {
        const date = new Date(timeStart);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return "Date TBD";
    }
};

const EventDetailsModal = ({
  event,
  onClose,
  onBook,
  isCreator,
}: {
  event: Event | null;
  onClose: () => void;
  onBook: () => void;
  isCreator: boolean;
}) => {
  if (!event) return null;

  const imgUrl = `http://localhost:8080/events/update/images/${event.ID}`;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl p-6 shadow-2xl 
                      max-h-[80vh] overflow-y-auto">

        {/* Banner Image */}
        <img
          src={imgUrl}
          className="w-full h-56 md:h-72 object-cover rounded-2xl"
        />

        {/* Title + Add Button */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-3xl font-bold leading-tight">{event.Name}</h2>

          {!isCreator && (
            <button
              onClick={onBook}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-base font-semibold 
                         hover:bg-blue-700 transition"
            >
              Add Event
            </button>
          )}
        </div>

        {/* Creator */}
        <p className="text-gray-600 mt-1 text-base">
          By {event.UserName ?? "User"}
        </p>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Description</h3>
          <p className="mt-2 text-gray-700 leading-relaxed">
            {event.Description}
          </p>
        </div>

        {/* Location */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Location</h3>
          <div className="flex items-start gap-3 mt-2 text-gray-700">
            <span className="text-2xl">📍</span>
            <p>{event.Location}</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Date & Time</h3>
          <div className="flex items-start gap-3 mt-2 text-gray-700">
            <span className="text-2xl">🕒</span>
            <div>
              <p><strong>Start:</strong> {formatDate(event.TimeStart)}</p>
              <p className="mt-1"><strong>End:</strong> {formatDate(event.TimeEnd)}</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gray-200 rounded-xl text-lg font-medium 
                     hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- NEW EventCard Component ---
const EventCard: React.FC<{ event: Event; onClick: () => void }> = ({
  event,
  onClick,
}) => {
  const imageUrl = `http://localhost:8080/events/update/images/${event.ID}`;
  return (
    <div
      onClick={onClick}
      className="rounded-xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer hover:scale-[1.02] transition"
    >
      <div className="h-32">
        <img src={imageUrl} alt={event.Name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 bg-[#a7a9cc] text-white">
        <div className="flex justify-between items-start text-lg font-semibold">
          <h2 className="line-clamp-1">{event.Name}</h2>
          <span className="text-sm ml-2">{event.Location}</span>
        </div>
        <p className="text-sm mt-1 line-clamp-2">{event.Description}</p>
        <p className="text-sm mt-3 pt-3 border-t border-white/30">
          {formatDate(event.TimeStart)}
        </p>
      </div>
    </div>
  );
};

export default function EventsPageView({
  events,
  isAuthenticated,
  currentUserId = 0,
}: EventsPageViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Booking function
  const bookEvent = async () => {
    if (!selectedEvent) return;

    const res = await fetch(`http://localhost:8080/events/book/${selectedEvent.ID}`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      alert("Event added!");
      setSelectedEvent(null); // CLOSE MODAL
    } else {
      alert("Failed to book event.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated ? <UserHeader /> : <Header />}

      {/* Banner */}
      <div className="w-full flex justify-center mt-6">
        <div className="w-[90%] max-w-5xl rounded-3xl overflow-hidden relative">
          <img
            src="/images/homepage.jpg"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-semibold">Look Forward to these Events!</h2>
            <p className="text-sm mt-2">Find out the current and upcoming events.</p>
          </div>
        </div>
      </div>

      {/* Events Near You */}
      <section className="w-[90%] max-w-6xl mx-auto mt-10">
        <h3 className="text-xl font-semibold mb-4">Events Near You</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => (
            <EventCard
              key={event.ID}
              event={event}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onBook={bookEvent}
        isCreator={selectedEvent?.UserID === currentUserId}
      />
    </div>
  );
}