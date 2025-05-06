import { fetchEventDetail } from "@/lib/api/events";
import EventDetail from "@/components/events/EventDetail";

export default async function EventDetailPage({ params }: { params: { eventid: string } }) {
  const event = await fetchEventDetail(params.eventid);
  return <EventDetail event={event} />;
}
