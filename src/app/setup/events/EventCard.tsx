import { FaMapMarkerAlt, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import localFont from 'next/font/local';
import { useState, useRef, useEffect } from 'react';
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
  media_url: string;
  location: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
  };
}

interface EventCardProps {
  event: EventCardData;
  currentUserId?: string | null;
  onEdit?: (event: EventCardData) => void;
}

export default function EventCard({ event, currentUserId, onEdit }: EventCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  // Close menu on outside click
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

  const isOwner = currentUserId && event.user_id === currentUserId;

  const handleDelete = () => {
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    const { error } = await supabase.from('posts').delete().eq('id', event.id);
    if (error) {
      setDeleteError('Failed to delete event.');
    } else {
      setDeleted(true);
      setShowDeleteModal(false);
    }
    setDeleteLoading(false);
  };

  if (deleted) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center text-center gap-3 relative">
      {/* Ellipsis menu for owner */}
      {isOwner && (
        <div className="absolute top-3 right-3 z-10" ref={menuRef}>
          <button
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 focus:outline-none"
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
                  handleDelete();
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      {event.media_url && (
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 mx-auto mb-2">
          <img
            src={event.media_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h2 className={`text-lg font-bold text-black mb-1 ${russoOne.className}`}>{event.title}</h2>
      <div
        className={`text-gray-800 mb-2 text-left ${spaceGroteskMed.className} break-words overflow-hidden rich-text-content`}
        style={{
          maxHeight: '12em',
          overflow: 'auto',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: event.body }}
      />
      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 mb-1 items-center">
        <span className="flex items-center"><FaMapMarkerAlt className="mr-1" />{event.location}</span>
        <span className="flex items-center"><FaCalendarAlt className="mr-1" />{new Date(event.created_at).toLocaleDateString()}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2 items-center">
        <span className="text-xs font-semibold text-black">{event.profiles?.username || 'Anonymous'}</span>
        <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-black">{event.category.replace(/-/g, ' ')}</span>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Delete Event</h2>
            <p className="mb-4 text-gray-700">Are you sure you want to delete <span className="font-semibold">{event.title}</span>? This action cannot be undone.</p>
            {deleteError && <p className="text-red-500 mb-2">{deleteError}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 