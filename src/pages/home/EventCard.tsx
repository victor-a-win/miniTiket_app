import Link from "next/link";

type EventCardProps = {
  event: {
    id: string;
    name: string;
    price: number;
    start_date: string;
    location: string;
    image_url?: string;
  };
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.name}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg">{event.name}</h3>
        <p className="text-gray-600">
          📅 {new Date(event.start_date).toLocaleDateString("id-ID")}
        </p>
        <p className="text-gray-600">📍 {event.location}</p>
        <p className="font-semibold mt-2">
          {event.price === 0 ? "Gratis" : `Rp ${event.price.toLocaleString("id-ID")}`}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}