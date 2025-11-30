import BookedEventsPageView from "./BookedEventsPageView";
import { getBookedEventsServerSide } from "../../services/serverEventService";
import UserHeader from "../../component/userHeader";

export default async function MyEventsPage() {
  const events = await getBookedEventsServerSide();
  if (!events) {
    return (
      <>
        <UserHeader />
        <div className="container mx-auto px-4 mt-10 text-center">
          <h2 className="text-xl text-red-500">Session Expired</h2>
          <p>Please log in to view your bookings.</p>
        </div>
      </>
    );
  }

  return <BookedEventsPageView events={events} />;
}