import { useState, useEffect, useRef } from 'react';
import localFont from 'next/font/local';
import RichTextEditor from './RichTextEditor';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/SpaceGrotesk-Medium.ttf',
  display: 'swap',
});

const allowedCategories = [
  'general',
  'looking-for-musicians',
  'venue-available',
  'lessons',
  'show-announcement',
  'promotion',
];

// Dynamically import MapContainer and Marker to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// Custom purple pin icon for the event form (simple teardrop shape)
const purplePinIcon = L.divIcon({
  className: 'custom-form-pin',
  html: `
    <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 46C16 46 28 30 16 30C4 30 16 46 16 46Z" fill="#7F5AF0" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="12" fill="#7F5AF0" stroke="white" stroke-width="2"/>
    </svg>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 46],
  popupAnchor: [0, -46],
});

// Custom LocationPickerMap component for map logic
const LocationPickerMap = ({ latitude, longitude, setLatitude, setLongitude }: { latitude: number; longitude: number; setLatitude: (lat: number) => void; setLongitude: (lng: number) => void; }) => {
  const mapRef = useRef<any>(null);

  // Set mapRef.current after mount
  const handleMapReady = (mapInstance: L.Map) => {
    mapRef.current = mapInstance;
  };

  // Map click handler
  const MapClickHandler = () => {
    const map = useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      key={`event-form-map-${latitude}-${longitude}`}
      center={[latitude || 37.0902, longitude || -95.7129]}
      zoom={latitude && longitude ? 13 : 4}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution={'&copy; OpenStreetMap contributors'}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      <Marker
        position={[latitude || 37.0902, longitude || -95.7129]}
        icon={purplePinIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const position = marker.getLatLng();
            setLatitude(position.lat);
            setLongitude(position.lng);
          },
        }}
      />
    </MapContainer>
  );
};

async function getCityStateFromLatLng(lat: number, lng: number): Promise<string | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'JamSeshApp/1.0 (your-email@example.com)'
    }
  });
  if (!response.ok) return null;
  const data = await response.json();
  const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.county;
  const state = data.address.state || data.address.region;
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return null;
}

interface EventFormProps {
  initialValues?: {
    title?: string;
    body?: string;
    category?: string;
    latitude?: number;
    longitude?: number;
    thumbnail_url?: string;
    event_datetime?: string;
  };
  onSubmit: (values: {
    title: string;
    body: string;
    category: string;
    latitude?: number;
    longitude?: number;
    thumbnail_url?: string;
    event_datetime?: string;
    location?: string;
  }) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
}

export default function EventForm({ initialValues = {}, onSubmit, loading = false, error, success }: EventFormProps) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [body, setBody] = useState(initialValues.body || '');
  const [category, setCategory] = useState(initialValues.category || 'general');
  const [latitude, setLatitude] = useState(initialValues.latitude || '');
  const [longitude, setLongitude] = useState(initialValues.longitude || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValues.thumbnail_url || '');
  const [uploading, setUploading] = useState(false);
  const [showMapFields, setShowMapFields] = useState(
    initialValues.latitude !== undefined && initialValues.longitude !== undefined
  );
  const [showDateTimeField, setShowDateTimeField] = useState(
    initialValues.event_datetime !== undefined && initialValues.event_datetime !== null
  );
  const [eventDateTime, setEventDateTime] = useState(
    initialValues.event_datetime
      ? new Date(initialValues.event_datetime).toISOString().slice(0, 16)
      : ''
  );

  // Geolocate when 'Where?' is toggled on, but only for new events (no initial lat/lng)
  useEffect(() => {
    if (showMapFields && !initialValues.latitude && !initialValues.longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLatitude(pos.coords.latitude);
            setLongitude(pos.coords.longitude);
          },
          () => {},
          { enableHighAccuracy: true }
        );
      }
    }
    // eslint-disable-next-line
  }, [showMapFields]);

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return;
    }
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error } = await supabase.storage.from('post-media').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      alert('Image upload failed.');
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('post-media').getPublicUrl(filePath);
    if (publicUrlData?.publicUrl) {
      setThumbnailUrl(publicUrlData.publicUrl);
    } else {
      alert('Failed to get image URL.');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowedCategories.includes(category)) {
      alert('Please select a valid category.');
      return;
    }
    let locationValue = '';
    if (showMapFields && latitude && longitude) {
      locationValue = (await getCityStateFromLatLng(Number(latitude), Number(longitude))) || '';
    }
    await onSubmit({
      title,
      body,
      category,
      thumbnail_url: thumbnailUrl,
      location: locationValue,
      ...(showMapFields && latitude && longitude
        ? {
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
          }
        : {}),
      ...(showDateTimeField && eventDateTime
        ? { event_datetime: new Date(eventDateTime).toISOString() }
        : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-4">
      <div className="flex flex-col items-center">
        <label htmlFor="thumbnail" className="text-white mb-2">Event Thumbnail</label>
        {thumbnailUrl && (
          <img src={thumbnailUrl} alt="Event Thumbnail" className="mb-2 rounded-lg w-32 h-32 object-cover border border-white/20" />
        )}
        <input type="file" id="thumbnail" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleThumbnailChange} className="p-2 rounded bg-white/20 text-white border border-white/10 w-full" disabled={uploading} />
        {uploading && <p className="text-gray-300 text-sm mt-1">Uploading...</p>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="title" className="text-white mb-2">Title</label>
        <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 rounded bg-white/20 text-white border border-white/10" required />
      </div>
      <div className="flex flex-col">
        <label htmlFor="body" className="text-white mb-2">Description</label>
        <div className="w-full">
          <RichTextEditor value={body} onChange={setBody} />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-white mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {allowedCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-3 py-1 rounded-full text-sm ${category === cat ? 'bg-[#7F5AF0] text-white' : 'bg-gray-700 text-gray-300'} transition-colors`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showMapFields"
          checked={showMapFields}
          onChange={() => setShowMapFields((v) => !v)}
          className="accent-[#7F5AF0] w-5 h-5 rounded focus:ring-2 focus:ring-[#7F5AF0]/40 border border-white/20"
        />
        <label htmlFor="showMapFields" className="text-white select-none cursor-pointer">
          Where?
        </label>
      </div>
      {showMapFields && (
        <div className="flex flex-col gap-2 mb-2">
          <label className="text-white mb-2">Select location on map (click to place pin, drag to fine-tune)</label>
          <div className="w-full h-64 rounded-lg overflow-hidden border border-white/20">
            <LocationPickerMap
              latitude={Number(latitude) || 37.0902}
              longitude={Number(longitude) || -95.7129}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showDateTimeField"
          checked={showDateTimeField}
          onChange={() => setShowDateTimeField((v) => !v)}
          className="accent-[#7F5AF0] w-5 h-5 rounded focus:ring-2 focus:ring-[#7F5AF0]/40 border border-white/20"
        />
        <label htmlFor="showDateTimeField" className="text-white select-none cursor-pointer">
          When?
        </label>
      </div>
      {showDateTimeField && (
        <div className="flex flex-col w-full mb-2">
          <label htmlFor="eventDateTime" className="text-white mb-2">Event Date & Time</label>
          <input
            type="datetime-local"
            id="eventDateTime"
            name="eventDateTime"
            value={eventDateTime}
            onChange={e => setEventDateTime(e.target.value)}
            className="p-2 rounded bg-white/20 text-white border border-white/10"
          />
        </div>
      )}
      <button type="submit" className={`bg-[#7F5AF0] text-white p-2 rounded ${spaceGroteskMed.className}`} disabled={loading}>
        {loading ? 'Saving...' : 'Save Event'}
      </button>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      {success && <p className="text-green-500 mt-2 text-center">Event saved successfully!</p>}
    </form>
  );
} 