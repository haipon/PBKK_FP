import { cookies } from "next/headers";
import HomePageView from "./HomePageView";

export default async function Home() {

  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization");
  
  const isAuthenticated = !!token;

  return <HomePageView isAuthenticated={isAuthenticated} />;
}