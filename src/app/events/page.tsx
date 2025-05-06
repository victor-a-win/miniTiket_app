"use client";
import { useEffect, useState } from "react";
import EventCard from "@/components/events/EventCard";
import { Event } from "@/interfaces/event.interface";
import { fetchEvents } from "@/lib/api/events";

export default function EventsLandingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  const filtered = events.filter(e =>
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())) &&
    (category ? e.category === category : true) &&
    (location ? e.location === location : true)
  );

  const categories = Array.from(new Set(events.map(e => e.category)));
  const locations = Array.from(new Set(events.map(e => e.location)));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Daftar Event</h1>
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari event..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded-lg bg-gray-800 text-white"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 rounded-lg bg-gray-800 text-white">
          <option value="">Semua Kategori</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={location} onChange={e => setLocation(e.target.value)} className="p-2 rounded-lg bg-gray-800 text-white">
          <option value="">Semua Lokasi</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>
      {/* Event List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(event => <EventCard key={event.id} event={event} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-10">Tidak ada event ditemukan.</div>
      )}
    </div>
  );
}
