"use client"
import { useEffect, useState } from 'react'
import localFont from 'next/font/local'
import { supabase } from '@/lib/supabase'
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaFilter, FaUserCircle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

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
  media_url: string;
  location: string;
  created_at: string;
  user_id: string;
  profiles: {
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

export default function AllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-0 gap-y-3 justify-start">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col overflow-hidden p-0"
            style={{ width: '320px', height: '440px', margin: '0 auto' }}
            onClick={() => setSelectedEvent(event)}
            role="button"
            tabIndex={0}
            onKeyPress={e => { if (e.key === 'Enter') setSelectedEvent(event); }}
            style={{ width: '320px', height: '440px', margin: '0 auto', cursor: 'pointer' }}
          >
            {event.media_url && (
              <div className="w-full" style={{ height: '300px', background: '#f3f4f6' }}>
                <img
                  src={event.media_url}
                  alt={event.title}
                  className="w-full h-full"
                  style={{ objectFit: 'contain', width: '100%', height: '100%', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
                />
              </div>
            )}
            <div className="flex flex-col flex-1 px-6 pt-5 pb-3 overflow-hidden">
              <h2 className={`text-2xl font-bold text-black mb-2 text-left truncate ${russoOne.className}`}>{event.title}</h2>
              <p className={`text-gray-700 text-base mb-4 text-left overflow-hidden ${spaceGroteskMed.className}`} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{event.body.replace(/<[^>]+>/g, '')}</p>
              <div className="mt-auto flex flex-col gap-1 text-left">
                <span className="flex items-center text-gray-500 text-sm mb-1"><FaCalendarAlt className="mr-2" />{new Date(event.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredEvents.length === 0 && (
        <p className={`text-gray-500 mt-8 ${spaceGroteskMed.className}`}>No events found. Try a different search or filter.</p>
      )}
      {/* Modal Popup for Event Details */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#18181b] rounded-2xl shadow-2xl p-8 max-w-lg w-full relative text-white">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white focus:outline-none" aria-label="Close modal" title="Close modal">
              <IoMdClose />
            </button>
            {selectedEvent.media_url && (
              <div className="w-full mb-6" style={{ height: '180px', background: '#23232b', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem', overflow: 'hidden' }}>
                <img
                  src={selectedEvent.media_url}
                  alt={selectedEvent.title}
                  className="w-full h-full"
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                />
              </div>
            )}
            <h2 className={`text-4xl font-bold mb-4 text-center ${russoOne.className}`}>{selectedEvent.title}</h2>
            <div className="flex flex-col gap-2 items-center mb-6">
              <span className="flex items-center gap-2 text-lg"><FaCalendarAlt /> {new Date(selectedEvent.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <span className="flex items-center gap-2 text-lg"><FaMapMarkerAlt /> {selectedEvent.location}</span>
            </div>
            <div className="mb-6">
              <h3 className="uppercase text-xs text-gray-400 font-bold mb-1 tracking-wider">About Event</h3>
              <p className="text-base text-gray-200 mb-1">{selectedEvent.body.replace(/<[^>]+>/g, '')}</p>
            </div>
            <div className="mb-6">
              <h3 className="uppercase text-xs text-gray-400 font-bold mb-1 tracking-wider">Hosted By</h3>
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-3xl text-[#7F5AF0]" />
                <span className="text-lg font-semibold">{selectedEvent.profiles?.username || 'Anonymous'}</span>
              </div>
            </div>
            {/* Attendees section (add real data here in the future) */}
          </div>
        </div>
      )}
    </div>
  );
} 