"use client"
import localFont from 'next/font/local'
import { FaPlus, FaEdit, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import EventCard from '../events/EventCard';
import EventPostModal from '../events/EventPostModal';

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
  thumbnail_url?: string;
  user_id?: string;
  profiles?: {
    username: string;
  };
  latitude?: number;
  longitude?: number;
  event_datetime?: string;
}

interface EventEditForm extends Partial<Event> {
  location?: string;
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
  const [editForm, setEditForm] = useState<EventEditForm>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [modalEvent, setModalEvent] = useState<Event | null>(null);

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

  const handleCreateClick = () => {
    setModalMode('create');
    setModalEvent(null);
    setModalOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setModalMode('edit');
    setModalEvent(event);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalMode('view');
    setModalEvent(null);
    setError(null);
  };

  const handleCreateEvent = async (values: any) => {
    setSaving(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const user_id = session.user.id;
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...values, user_id }])
        .select();
      if (error) throw error;
      setEvents([...(data || []), ...events]);
      handleModalClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  const handleEditEvent = async (values: any) => {
    if (!modalEvent) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: values.title,
          body: values.body,
          category: values.category,
          thumbnail_url: values.thumbnail_url,
          location: (values as any).location ?? modalEvent.location ?? '',
          latitude: values.latitude ?? modalEvent.latitude,
          longitude: values.longitude ?? modalEvent.longitude,
          event_datetime: values.event_datetime ?? modalEvent.event_datetime,
        })
        .eq('id', modalEvent.id);
      if (error) throw error;
      setEvents(events.map(ev => ev.id === modalEvent.id ? { ...ev, ...values } : ev));
      handleModalClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className={`text-3xl font-bold mb-2 text-white ${russoOne.className}`}>Your <span className="text-[#7F5AF0]">hosted events</span></h1>
      <p className={`text-gray-300 mb-8 ${spaceGroteskMed.className}`}>This is where you can create a new event or find all the events you have created.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button onClick={handleCreateClick}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-0 cursor-pointer hover:bg-white/20 transition-colors flex flex-col items-center text-center relative group overflow-hidden h-full shadow-md"
          style={{ minHeight: '100%' }}
        >
          <div className="w-full h-40 rounded-t-xl overflow-hidden bg-white/10 border-b border-white/20 backdrop-blur-lg flex items-center justify-center">
            <FaPlus size={40} className="text-[#7F5AF0]" />
          </div>
          <div className="p-4 w-full flex flex-col items-center">
            <p className={`text-lg font-bold text-[#7F5AF0] mb-1 truncate w-full ${spaceGroteskMed.className}`}>+ NEW EVENT</p>
          </div>
        </button>
        {loading ? (
          <div className="text-white col-span-full">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-white/70 col-span-full">No events created yet. Create your first event!</div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={{ ...event, user_id: (event as any).user_id || userId || '', body: event.body || '' }}
              currentUserId={userId}
              onEdit={handleEditClick}
            />
          ))
        )}
      </div>
      <EventPostModal
        event={modalEvent as any}
        open={modalOpen}
        onClose={handleModalClose}
        currentUserId={userId}
        mode={modalMode}
        onSubmit={modalMode === 'create' ? handleCreateEvent : handleEditEvent}
        loading={saving}
        error={error}
      />
    </div>
  )
} 