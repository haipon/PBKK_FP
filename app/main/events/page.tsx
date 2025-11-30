import EventsClientView from "./EventsPageView";
import { getPublicEventsServerSide } from "../../services/serverEventService";
import { cookies } from "next/headers"; // Import cookies to check auth

export default async function EventsPage() {
  const events = await getPublicEventsServerSide();

  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization");
  const isAuthenticated = !!token;

  return (
    <EventsClientView 
      events={events} 
      isAuthenticated={isAuthenticated} 
    />
  );
}