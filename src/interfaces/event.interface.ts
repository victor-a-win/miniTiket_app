export interface Event {
    id: string;
    name: string;
    price: number;
    start_date: string;
    end_date: string;
    location: string;
    seats: number;
    category: string;
    image_url?: string;
    description: string;
    user?: { first_name: string; last_name: string };
    created_at?: string; 
    user_id?: string;
    organizer?: string;
    vouchers?: string;
  } 

export interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingEvent?: Event | null;
  onSuccess: (event: Event) => void;
}