import { useState } from 'react';
import localFont from 'next/font/local';
import RichTextEditor from './RichTextEditor';
import { supabase } from '@/lib/supabase';

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

interface EventFormProps {
  initialValues?: {
    title?: string;
    body?: string;
    category?: string;
    latitude?: number;
    longitude?: number;
    thumbnail_url?: string;
  };
  onSubmit: (values: {
    title: string;
    body: string;
    category: string;
    latitude?: number;
    longitude?: number;
    thumbnail_url?: string;
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
    const { error } = await supabase.storage.from('event-thumbnails').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      alert('Image upload failed.');
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('event-thumbnails').getPublicUrl(filePath);
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
    await onSubmit({
      title,
      body,
      category,
      thumbnail_url: thumbnailUrl,
      ...(showMapFields && latitude && longitude
        ? {
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
          }
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
        <RichTextEditor value={body} onChange={setBody} />
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
          Put me on the map!
        </label>
      </div>
      {showMapFields && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="latitude" className="text-white mb-2">Latitude</label>
            <input type="number" id="latitude" name="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="p-2 rounded bg-white/20 text-white border border-white/10" step="any" />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="longitude" className="text-white mb-2">Longitude</label>
            <input type="number" id="longitude" name="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="p-2 rounded bg-white/20 text-white border border-white/10" step="any" />
          </div>
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