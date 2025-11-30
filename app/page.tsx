import { cookies } from "next/headers";
import HomePageView from "./HomePageView";

export default async function Home() {
  // 1. Check Authentication on Server
  // (Remember to await cookies() in Next.js 15)
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization");
  
  // 2. Convert to boolean
  const isAuthenticated = !!token;

  // 3. Render View
  return <HomePageView isAuthenticated={isAuthenticated} />;
}