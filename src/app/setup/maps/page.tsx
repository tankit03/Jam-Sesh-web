"use client"
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';
import localFont from 'next/font/local';

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

interface Event {
  id: string;
  title: string;
  event_datetime?: string;
  latitude?: number;
  longitude?: number;
}

export default function EventMaps() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, event_datetime, latitude, longitude');
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

  return (
    <div className="p-8">
      <h1 className={`text-3xl font-bold mb-6 text-white ${russoOne.className}`}>
        Event <span className="text-[#7F5AF0]">Maps</span>
      </h1>
      <p className={`text-gray-300 mb-6 ${spaceGroteskMed.className}`}>See all events on the map. Click a pin for details.</p>
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-white/20 bg-white/5">
        <MapContainer
          key="event-maps"
          center={[37.0902, -95.7129]}
          zoom={4}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution={'&copy; OpenStreetMap contributors'}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {events.map(ev => (
            <Marker
              key={ev.id}
              position={[ev.latitude!, ev.longitude!]}
              icon={markerIcon}
            >
              <Popup>
                <div>
                  <div className="font-bold text-base mb-1">{ev.title}</div>
                  {ev.event_datetime && (
                    <div className="text-xs text-gray-700 mb-1">
                      {new Date(ev.event_datetime).toLocaleString()}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {loading && <p className="text-white mt-4">Loading events...</p>}
      {!loading && events.length === 0 && <p className="text-gray-400 mt-4">No events with locations yet.</p>}
    </div>
  );
} 