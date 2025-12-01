import EventsClientView from "./EventsPageView";
import { getPublicEventsServerSide, getCurrentUserServerSide, getBookedEventsServerSide } from "../../services/serverEventService";
import { cookies } from "next/headers"; // Import cookies to check auth

export default async function EventsPage() {
  // Fetch user data
  const [events, user, bookedEvents] = await Promise.all([getPublicEventsServerSide(), getCurrentUserServerSide(), getBookedEventsServerSide()]);

  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization");
  const isAuthenticated = !!token;
  const currentUserId = user ? user.ID : 0;

const bookedEventIds = bookedEvents
    ? bookedEvents.map((e: any) => e.ID) 
    : [];

  return (
    <EventsClientView 
      events={events} 
      isAuthenticated={isAuthenticated}
      currentUserId={currentUserId}
      bookedEventIds={bookedEventIds}
    />
  );
}