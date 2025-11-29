import EventsPageView from "./EventsPageView";

// Fetch the data from the backend
async function getEvents() {
  const res = await fetch('http://127.0.0.1:8080/events', {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export default async function EventsView() {
  const response = await getEvents();

  console.log("API Response:", response);

  return <EventsPageView events={response.event} />;
}