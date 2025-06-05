import { useState } from 'react';
import localFont from 'next/font/local';
import RichTextEditor from './RichTextEditor';

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
    media_url?: string;
    location?: string;
  };
  onSubmit: (values: {
    title: string;
    body: string;
    category: string;
    media_url: string;
    location: string;
  }) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
}

export default function EventForm({ initialValues = {}, onSubmit, loading = false, error, success }: EventFormProps) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [body, setBody] = useState(initialValues.body || '');
  const [category, setCategory] = useState(initialValues.category || 'general');
  const [media_url, setMediaUrl] = useState(initialValues.media_url || '');
  const [location, setLocation] = useState(initialValues.location || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowedCategories.includes(category)) {
      alert('Please select a valid category.');
      return;
    }
    await onSubmit({ title, body, category, media_url, location });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-4">
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
      <div className="flex flex-col">
        <label htmlFor="media_url" className="text-white mb-2">Media URL</label>
        <input type="text" id="media_url" name="media_url" value={media_url} onChange={(e) => setMediaUrl(e.target.value)} className="p-2 rounded bg-white/20 text-white border border-white/10" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="location" className="text-white mb-2">Location</label>
        <input type="text" id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="p-2 rounded bg-white/20 text-white border border-white/10" />
      </div>
      <button type="submit" className={`bg-[#7F5AF0] text-white p-2 rounded ${spaceGroteskMed.className}`} disabled={loading}>
        {loading ? 'Saving...' : 'Save Event'}
      </button>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      {success && <p className="text-green-500 mt-2 text-center">Event saved successfully!</p>}
    </form>
  );
} 