"use client"
import { useEffect, useState, useRef, Fragment } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';
import localFont from 'next/font/local';
import EventPostModal from '../events/EventPostModal';

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

// Dynamic imports for react-leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker icon for thumbnail pins
function createThumbnailPinIcon(thumbnailUrl: string, hovered: boolean = false) {
  const safeUrl =
    typeof thumbnailUrl === 'string' && thumbnailUrl.trim() !== ''
      ? thumbnailUrl
      : '/default-thumb.svg';
  // Use a single root div, no undefined values, no extra tags
  const html =
    '<div class="pin-outer">' +
      '<div class="pin-inner">' +
        `<img src="${safeUrl}" alt="Event Thumbnail" />` +
      '</div>' +
      '<div class="pin-tip"></div>' +
    '</div>';
  return L.divIcon({
    className: `custom-thumbnail-pin${hovered ? ' grow' : ''}`,
    html,
    iconSize: [48, 64],
    iconAnchor: [24, 64],
    popupAnchor: [0, -64],
  });
}

interface Event {
  id: string;
  title: string;
  event_datetime?: string;
  latitude?: number;
  longitude?: number;
  thumbnail_url?: string;
  body?: string;
  category?: string;
  user_id?: string;
  profiles?: { username: string };
  location?: string;
  created_at?: string;
}

export default function EventMaps() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.0902, -95.7129]);
  const [mapZoom, setMapZoom] = useState(4);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id || null);
    });
  }, []);

  // Geolocate user on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
          setMapZoom(12);
          if (mapRef.current) {
            mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 12);
          }
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, event_datetime, latitude, longitude, thumbnail_url');
      if (!error && data) {
        setEvents(data.filter((ev: Event) => ev.latitude && ev.longitude));
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Fit map to markers if events exist
  useEffect(() => {
    if (mapRef.current && events.length > 0) {
      const bounds = L.latLngBounds(events.map(ev => [ev.latitude!, ev.longitude!]));
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [events]);

  // Pin click handler: fetch full post
  const handlePinClick = async (ev: Event) => {
    setModalLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`*, profiles:user_id (username)`)
      .eq('id', ev.id)
      .single();
    if (!error && data) {
      setSelectedEvent({ ...data });
    } else {
      setSelectedEvent({ ...ev }); // fallback to minimal data
    }
    setModalLoading(false);
  };

  return (
    <div className="p-2 md:p-4 lg:p-6 pt-0">
      <h1 className={`text-3xl font-bold mb-2 text-white ${russoOne.className} mt-0`}>
        Event <span className="text-[#7F5AF0]">Map</span>
      </h1>
      <p className={`text-gray-300 mb-2 ${spaceGroteskMed.className}`}>See all events on the map. Click a pin for details.</p>
      <div
        className="w-full rounded-lg overflow-hidden border border-white/20 bg-white/5 relative"
        style={{ height: '80vh' }}
      >
        <MapContainer
          key={`event-maps-${mapCenter[0]}-${mapCenter[1]}`}
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution={'&copy; OpenStreetMap contributors'}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {events.map(ev => (
            (typeof ev.latitude === 'number' && typeof ev.longitude === 'number' && !isNaN(ev.latitude) && !isNaN(ev.longitude)) ? (
              <Marker
                key={ev.id}
                position={[ev.latitude, ev.longitude]}
                icon={createThumbnailPinIcon(
                  typeof ev.thumbnail_url === 'string' && ev.thumbnail_url.trim() !== '' ? ev.thumbnail_url : '/default-thumb.svg',
                  hoveredPinId === ev.id
                )}
                eventHandlers={{
                  click: () => handlePinClick(ev),
                  mouseover: () => setHoveredPinId(ev.id),
                  mouseout: () => setHoveredPinId(null),
                }}
              />
            ) : null
          ))}
        </MapContainer>
      </div>
      {loading && <p className="text-white mt-4">Loading events...</p>}
      {!loading && events.length === 0 && <p className="text-gray-400 mt-4">No events with locations yet.</p>}
      {modalLoading && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="text-white text-xl font-bold">Loading post...</div>
        </div>
      )}
      <EventPostModal
        event={selectedEvent as any}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        currentUserId={userId}
      />
    </div>
  );
} 