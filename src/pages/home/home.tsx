// pages/Home.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'

type Event = {
  id: string;
  name: string;
  price: number;
  start_date: string;
  end_date: string;
  location: string;
  seats: number;
  category: string;
  image_url?: string;
  user: { first_name: string; last_name: string };
};

export default function HomeView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || null;
  const location = searchParams?.get('location') || null;
  const search = searchParams?.get('search') || null;

  useEffect(() => {
    async function loadEvents() {
      try {
        const queryParams = new URLSearchParams();
        if (category) queryParams.append('category', category as string);
        if (location) queryParams.append('location', location as string);
        if (search) queryParams.append('search', search as string);

        const res = await fetch(`/api/events?${queryParams.toString()}`);
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [category, location, search]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      
      {/* Simple Filter UI - Matches your schema fields */}
      <div className="flex gap-4 mb-6">
        <select 
          onChange={(e) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set('category', e.target.value);
            router.push(`?${params.toString()}`);
          }}
          value={category || ""}
        >
          <option value="">All Categories</option>
          {Array.from(new Set(events.map(e => e.category))).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set('location', e.target.value);
            router.push(`?${params.toString()}`);
          }}
          value={location || ""}
        >
          <option value="">All Locations</option>
          {Array.from(new Set(events.map(e => e.location))).map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="border rounded-lg p-4">
            <h3 className="font-bold">{event.name}</h3>
            <p>Organizer: {event.user.first_name} {event.user.last_name}</p>
            <p>Price: IDR {event.price.toLocaleString('id-ID')}</p>
            <p>Seats: {event.seats}</p>
            <button 
              onClick={() => router.push(`auth/events/${event.id}`)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}