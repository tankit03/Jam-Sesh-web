import { FaMapMarkerAlt, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import localFont from 'next/font/local';
import { useState } from 'react';
import EventPostModal from './EventPostModal';
import { supabase } from '@/lib/supabase';

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

export interface EventCardData {
  id: string;
  title: string;
  body: string;
  category: string;
  thumbnail_url?: string;
  location: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
  };
  latitude?: number;
  longitude?: number;
  event_datetime?: string;
}

interface EventCardProps {
  event: EventCardData;
  currentUserId?: string | null;
  onEdit?: (event: EventCardData) => void;
  onDelete?: (event: EventCardData) => void;
}

export default function EventCard({ event, currentUserId, onEdit, onDelete }: EventCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md border border-gray-200 p-0 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center text-center relative group overflow-hidden"
        onClick={() => setModalOpen(true)}
        tabIndex={0}
        role="button"
        aria-label={`View event: ${event.title}`}
      >
        {(event.thumbnail_url && event.thumbnail_url.trim() !== '') ? (
          <div className="w-full h-40 rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={event.thumbnail_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="w-full h-40 rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src="/default-thumb.svg"
              alt="Default Thumbnail"
              className="w-20 h-20 object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="p-4 w-full flex flex-col items-center">
          <h2 className={`text-lg font-bold text-black mb-1 truncate w-full ${russoOne.className}`}>{event.title}</h2>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 items-center">
            {event.location && (
              <span className="flex items-center"><FaMapMarkerAlt className="mr-1" />{event.location}</span>
            )}
            {event.event_datetime && (
              <span className="flex items-center"><FaCalendarAlt className="mr-1" />{new Date(event.event_datetime).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
      <EventPostModal
        event={event}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        currentUserId={currentUserId}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
} 