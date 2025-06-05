"use client"
import { useEffect, useState } from 'react'
import localFont from 'next/font/local'
import { supabase } from '@/lib/supabase'
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaFilter } from 'react-icons/fa'
import EventForm from '../create-event/EventForm'
import EventCard from './EventCard'
import EventPostModal from './EventPostModal'

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

interface Event {
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
}

const allowedCategories = [
  'general',
  'looking-for-musicians',
  'venue-available',
  'lessons',
  'show-announcement',
  'promotion',
];

export default function AllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchEvents();
    // Get current user ID
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id || null);
    });
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.body.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? event.category === category : true;
    return matchesSearch && matchesCategory;
  });

  // Edit event handler
  const handleEditSubmit = async (values: {
    title: string;
    body: string;
    category: string;
    latitude?: number;
    longitude?: number;
    thumbnail_url?: string;
    event_datetime?: string;
    location?: string;
  }) => {
    if (!editEvent) return;
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);
    const { error } = await supabase
      .from('posts')
      .update({
        title: values.title,
        body: values.body,
        category: values.category,
        thumbnail_url: values.thumbnail_url ?? editEvent.thumbnail_url,
        location: values.location ?? editEvent.location,
        latitude: values.latitude ?? editEvent.latitude,
        longitude: values.longitude ?? editEvent.longitude,
        event_datetime: values.event_datetime ?? null,
      })
      .eq('id', editEvent.id);
    if (error) {
      setEditError('Failed to update event.');
    } else {
      setEditSuccess(true);
      setEditEvent(null);
      setModalOpen(false);
      fetchEvents();
    }
    setEditLoading(false);
  };

  // Delete event handler
  const handleDelete = async () => {
    if (!selectedEvent) return;
    setDeleteLoading(true);
    setDeleteError(null);
    const { error } = await supabase.from('posts').delete().eq('id', selectedEvent.id);
    if (error) {
      setDeleteError('Failed to delete event.');
    } else {
      setShowDeleteConfirm(false);
      setModalOpen(false);
      setSelectedEvent(null);
      fetchEvents();
    }
    setDeleteLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-white">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className={`text-3xl font-bold mb-6 text-white ${russoOne.className}`}>
        All <span className="text-[#7F5AF0]">Events</span>
      </h1>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:outline-none bg-white text-black shadow"
          />
        </div>
        <div className="flex gap-2 items-center">
          <FaFilter className="text-gray-400" />
          <label htmlFor="category-filter" className="sr-only">Filter by category</label>
          <select
            id="category-filter"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white text-black px-3 py-2 shadow focus:border-black focus:outline-none"
          >
            <option value="">All Categories</option>
            {allowedCategories.map(cat => (
              <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>
      <p className={`text-gray-300 mb-6 ${spaceGroteskMed.className}`}>Preview all events or filter by location and category</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={{ ...event, profiles: event.profiles || { username: 'Anonymous' } }}
            currentUserId={userId}
            onEdit={event => {
              setEditEvent(event);
              setModalOpen(false);
            }}
            onDelete={event => {
              setSelectedEvent(event);
              setShowDeleteConfirm(true);
              setModalOpen(false);
            }}
          />
        ))}
      </div>
      {filteredEvents.length === 0 && (
        <p className={`text-gray-500 mt-8 ${spaceGroteskMed.className}`}>No events found. Try a different search or filter.</p>
      )}
      {/* Edit Modal */}
      {editEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1a1333] p-6 rounded-xl shadow-xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setEditEvent(null)}
            >
              &times;
            </button>
            <h2 className={`text-2xl font-bold mb-4 text-white ${russoOne.className}`}>Edit Event</h2>
            <EventForm
              initialValues={editEvent}
              onSubmit={handleEditSubmit}
              loading={editLoading}
              error={editError}
              success={editSuccess}
            />
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteLoading}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Delete Event</h2>
            <p className="mb-4 text-gray-700">Are you sure you want to delete <span className="font-semibold">{selectedEvent.title}</span>? This action cannot be undone.</p>
            {deleteError && <p className="text-red-500 mb-2">{deleteError}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
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