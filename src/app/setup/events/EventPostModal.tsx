import { FaMapMarkerAlt, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import localFont from 'next/font/local';
import { EventCardData } from './EventCard';
import { useState, useRef, useEffect } from 'react';

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

interface EventPostModalProps {
  event: EventCardData | null;
  open: boolean;
  onClose: () => void;
  currentUserId?: string | null;
  onEdit?: (event: EventCardData) => void;
  onDelete?: (event: EventCardData) => void;
}

export default function EventPostModal({ event, open, onClose, currentUserId, onEdit, onDelete }: EventPostModalProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  if (!open || !event) return null;

  const isOwner = currentUserId && event.user_id === currentUserId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh] border border-white/20">
        <button
          className="absolute top-2 right-2 bg-[#7F5AF0] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:scale-110 hover:bg-[#6c3ee6] transition-all text-2xl font-bold focus:outline-none z-20"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {isOwner && (
          <div className="absolute top-2 right-16 z-20" ref={menuRef}>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#7F5AF0] text-white shadow-lg hover:scale-110 hover:bg-[#6c3ee6] transition-all text-xl focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              <FaEllipsisV />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg py-1 text-left">
                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit && onEdit(event);
                  }}
                >
                  Edit
                </button>
                <div className="border-t border-gray-200 my-1" />
                <button
                  className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(event);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
        {(event.thumbnail_url && event.thumbnail_url.trim() !== '') ? (
          <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
            <img
              src={event.thumbnail_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
            <img
              src="/default-thumb.svg"
              alt="Default Thumbnail"
              className="w-24 h-24 object-cover"
            />
          </div>
        )}
        <h2 className={`text-2xl font-bold text-black mb-2 ${russoOne.className}`}>{event.title}</h2>
        <div className="flex flex-wrap gap-3 mb-3 text-gray-600 text-sm items-center">
          <span className="flex items-center"><FaMapMarkerAlt className="mr-1" />{event.location}</span>
          <span className="flex items-center"><FaCalendarAlt className="mr-1" />{new Date(event.created_at).toLocaleDateString()}</span>
          <span className="px-2 py-1 rounded-full bg-gray-200 text-black text-xs font-semibold">{event.category.replace(/-/g, ' ')}</span>
          <span className="text-xs font-semibold text-black">{event.profiles?.username || 'Anonymous'}</span>
        </div>
        <div
          className={`text-gray-900 mb-2 text-left ${spaceGroteskMed.className} break-words rich-text-content`}
          style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: event.body }}
        />
      </div>
    </div>
  );
} 