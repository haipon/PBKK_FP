import EventsClientView from "./EventsPageView";
import { getPublicEventsServerSide, getCurrentUserServerSide, getBookedEventsServerSide } from "../../services/serverEventService";
import { cookies } from "next/headers"; // Import cookies to check auth

interface EventsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const search = (params.search as string) || "";
  
  // Fetch user data
  const [events, user, bookedEvents] = await Promise.all([getPublicEventsServerSide(search), getCurrentUserServerSide(), getBookedEventsServerSide()]);

  Promise.all([
    getPublicEventsServerSide(search), 
    getCurrentUserServerSide(), 
    getBookedEventsServerSide()
  ]);

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