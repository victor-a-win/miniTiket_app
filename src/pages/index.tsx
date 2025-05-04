// pages/index.tsx
import { useState, useEffect } from "react";
import { fetchEvents } from "../lib/api";
import EventCard from "../components/EventCard";

type Event = {
  id: string;
  name: string;
  price: number;
  start_date: string;
  location: string;
  category: string;
  image_url?: string;
  description: string;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Fetch data event dari BE
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Gagal memuat event:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  // Filter event berdasarkan pencarian & kategori
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
    const matchesLocation = locationFilter ? event.location === locationFilter : true;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Dapatkan daftar kategori & lokasi unik untuk filter dropdown
  const categories = Array.from(new Set(events.map((event) => event.category)));
  const locations = Array.from(new Set(events.map((event) => event.location)));

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Memuat daftar event...</p>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada event
  if (filteredEvents.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Tidak ada event yang ditemukan</h1>
        <button 
          onClick={() => {
            setSearchTerm("");
            setCategoryFilter("");
            setLocationFilter("");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reset Filter
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Daftar Event</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Filter Kategori & Lokasi */}
      <div className="flex gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="">Semua Lokasi</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Daftar Event */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}