import { cookies } from 'next/headers';

export async function getCreatedEventsServerSide() {
  const cookieStore = await cookies();
  const token = cookieStore.get('Authorization'); // Get the cookie

  if (!token) return null;

  const res = await fetch("http://localhost:8080/profile/events", {
    method: 'GET',
    cache: 'no-store', 
    headers: {
      'Cookie': `Authorization=${token.value}`, // Forward the cookie
    },
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.event; 
}

export async function getBookedEventsServerSide() {
  const cookieStore = await cookies();
  const token = cookieStore.get('Authorization');

  if (!token) return null;

  const res = await fetch("http://localhost:8080/profile/booked", {
    method: 'GET',
    cache: 'no-store', 
    headers: {
      'Cookie': `Authorization=${token.value}`,
    },
  });

  if (!res.ok) return null;

  const json = await res.json();
  
  return json.event; 
}

export async function getPublicEventsServerSide() {
  const res = await fetch("http://localhost:8080/events", {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json.event; 
}