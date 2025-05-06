import { Event } from "@/interfaces/event.interface";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${API_URL}/events`);
  if (!res.ok) throw new Error("Gagal memuat event");
  return res.json();
}
export async function fetchEventDetail(id: string): Promise<Event> {
    const res = await fetch(`${API_URL}/events/${id}`);
    if (!res.ok) throw new Error("Event tidak ditemukan");
    return res.json();
  }
  