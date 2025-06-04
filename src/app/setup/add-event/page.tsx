"use client"
import localFont from 'next/font/local'
import { FaPlus, FaEdit, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/SpaceGrotesk-Medium.ttf',
  display: 'swap',
});

interface Event {
  id: string;
  title: string;
  body?: string;
  created_at: string;
  location: string;
  category: string;
  media_url: string;
  profiles?: {
    username: string;
  };
}

const allowedCategories = [
  'general',
  'looking-for-musicians',
  'venue-available',
  'lessons',
  'show-announcement',
  'promotion',
];

export default function AddEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editForm, setEditForm] = useState<Partial<Event>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingEvent && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, [editingEvent]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth/login');
          return;
        }
        const userId = session.user.id;
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (username)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setEditForm({ ...event });
    setError(null);
  };

  const closeEditModal = () => {
    setEditingEvent(null);
    setEditForm({});
    setError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (cat: string) => {
    setEditForm({ ...editForm, category: cat });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: editForm.title,
          body: editForm.body,
          category: editForm.category,
          media_url: editForm.media_url,
          location: editForm.location,
        })
        .eq('id', editingEvent.id);
      if (error) throw error;
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...editForm } as Event : ev));
      closeEditModal();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', eventId);
      if (error) throw error;
      setEvents(events.filter(ev => ev.id !== eventId));
      if (editingEvent && editingEvent.id === eventId) closeEditModal();
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to delete event');
    }
  };

  return (
    <div className="p-8">
      <h1 className={`text-4xl font-bold mb-4 text-white ${russoOne.className}`}>
        Create a New <span className="text-[#7F5AF0]">Event</span>
      </h1>
      <p className={`text-lg text-gray-300 mb-8 ${spaceGroteskMed.className}`}>
        Plan your next JamSesh event.
      </p>

      <Link href="/setup/create-event">
        <div className="max-w-sm bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-colors cursor-pointer">
          <div className="border-2 border-dashed border-white/30 rounded-lg p-6 flex flex-col items-center justify-center text-center aspect-square">
            <FaPlus size={40} className="text-white/50 mb-4" />
            <p className={`text-xl text-white/50 ${spaceGroteskMed.className}`}>
              + NEW EVENT
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-12">
        <h2 className={`text-2xl font-bold mb-6 text-white ${russoOne.className}`}>
          Your <span className="text-[#7F5AF0]">Hosted Events</span>
        </h2>
        {loading ? (
          <div className="text-white">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-white/70">No events created yet. Create your first event!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center text-center gap-3"
              >
                {/* Event Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 mx-auto mb-2 flex items-center justify-center">
                  {event.media_url ? (
                    <img src={event.media_url} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">{event.title}</span>
                  )}
                </div>
                {/* Title */}
                <h3 className={`text-xl font-bold text-black mb-1 ${russoOne.className}`}>{event.title}</h3>
                {/* Description */}
                {event.body && (
                  <p className={`text-gray-800 mb-2 text-left ${spaceGroteskMed.className} break-words overflow-hidden`} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '3em', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{event.body.replace(/<[^>]+>/g, '')}</p>
                )}
                {/* Location and Date */}
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 mb-1 items-center">
                  <span className="flex items-center"><FaMapMarkerAlt className="mr-1" />{event.location}</span>
                  <span className="flex items-center"><FaCalendarAlt className="mr-1" />{formatDate(event.created_at)}</span>
                </div>
                {/* Username and Category */}
                <div className="flex flex-wrap justify-center gap-2 items-center">
                  <span className="text-xs font-semibold text-black">{event.profiles?.username || 'Anonymous'}</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-black">{event.category.replace(/-/g, ' ')}</span>
                </div>
                {/* Edit/Delete Buttons */}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEditModal(event)} aria-label="Edit event">
                    <FaEdit className="text-gray-400 hover:text-black" />
                  </button>
                  <button onClick={() => handleDelete(event.id)} aria-label="Delete event" className="text-red-400 hover:text-red-600 font-bold text-lg">&times;</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#23272F] rounded-xl p-8 w-full max-w-lg shadow-2xl relative">
            <button onClick={closeEditModal} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">&times;</button>
            <h2 className={`text-2xl font-bold mb-4 text-white ${russoOne.className}`}>Edit Event</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-white mb-1">Title</label>
                <input
                  ref={initialFocusRef}
                  type="text"
                  name="title"
                  value={editForm.title || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-white/20 text-white border border-white/10"
                  required
                  placeholder="Event Title"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Description</label>
                <textarea
                  name="body"
                  value={editForm.body || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-white/20 text-white border border-white/10"
                  rows={3}
                  placeholder="Event Description"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Category</label>
                <div className="flex flex-wrap gap-2">
                  {allowedCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm ${editForm.category === cat ? 'bg-[#7F5AF0] text-white' : 'bg-gray-700 text-gray-300'} transition-colors`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white mb-1">Media URL</label>
                <input
                  type="text"
                  name="media_url"
                  value={editForm.media_url || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-white/20 text-white border border-white/10"
                  placeholder="Media URL"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-white/20 text-white border border-white/10"
                  placeholder="Location"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-between gap-2">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600">Cancel</button>
                <button type="button" onClick={() => handleDelete(editingEvent.id)} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
                <button type="submit" className="px-4 py-2 rounded bg-[#7F5AF0] text-white hover:bg-[#6841c6]" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 