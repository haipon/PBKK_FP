import DashboardPageView from "./DashboardPageView";
import { getCreatedEventsServerSide, getCurrentUserServerSide } from "../../services/serverEventService";
import UserHeader from "../../component/userHeader";

export default async function DashboardPage() {
  const [events, user] = await Promise.all([getCreatedEventsServerSide(), getCurrentUserServerSide()]);

  const username = user ? user.Name : "User";

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

  return <DashboardPageView events={events} username={username}/>;
}