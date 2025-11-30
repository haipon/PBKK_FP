import DashboardPageView from "./DashboardPageView";
import { getCreatedEventsServerSide } from "../../services/serverEventService";
import UserHeader from "../../component/userHeader";

export default async function DashboardPage() {
  const events = await getCreatedEventsServerSide();

  if (!events) {
    return (
      <>
        <UserHeader />
        <div className="container mx-auto px-4 mt-10 text-center">
          <h2 className="text-xl text-red-500">Session Expired</h2>
          <p>Please log in to view your dashboard.</p>
        </div>
      </>
    );
  }

  return <DashboardPageView events={events} />;
}