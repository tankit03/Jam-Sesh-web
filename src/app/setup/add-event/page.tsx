"use client"
import localFont from 'next/font/local'
import { FaPlus, FaEdit, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import EventCard from '../events/EventCard';

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
  user_id?: string;
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

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editForm, setEditForm] = useState<Partial<Event>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
        setUserId(session?.user.id || null);
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

  return (
    <div className="p-8">
      <h1 className={`text-3xl font-bold mb-2 text-white ${russoOne.className}`}>Your <span className="text-[#7F5AF0]">hosted events</span></h1>
      <p className={`text-gray-300 mb-8 ${spaceGroteskMed.className}`}>This is where you can create a new event or find all the events you have created.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/setup/create-event" className="h-full w-full">
          <div className="h-full w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-colors cursor-pointer flex flex-col justify-center">
            <div className="border-2 border-dashed border-white/30 rounded-lg p-6 flex flex-col items-center justify-center text-center aspect-square">
              <FaPlus size={40} className="text-white/50 mb-4" />
              <p className={`text-xl text-white/50 ${spaceGroteskMed.className}`}>+ NEW EVENT</p>
            </div>
          </div>
        </Link>
        {loading ? (
          <div className="text-white col-span-full">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-white/70 col-span-full">No events created yet. Create your first event!</div>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={{ ...event, user_id: (event as any).user_id || userId || '', body: event.body || '' }} currentUserId={userId} onEdit={editingEvent && editingEvent.id === event.id ? undefined : (userId && event.user_id === userId ? () => setEditingEvent(event) : undefined)} />
          ))
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