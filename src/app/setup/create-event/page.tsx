"use client";
import localFont from 'next/font/local';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Replace with your actual Supabase URL and public key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/SpaceGrotesk-Medium.ttf',
  display: 'swap',
});

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [media_url, setMediaUrl] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Allowed categories based on the database constraint
  const allowedCategories = [
    'general',
    'looking-for-musicians',
    'venue-available',
    'lessons',
    'show-announcement',
    'promotion',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Get the authenticated user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setError('You must be logged in to create an event.');
      setLoading(false);
      return;
    }

    const user_id = session.user.id;

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          user_id: user_id,
          title: title,
          body: body,
          category: category,
          media_url: media_url,
          location: location 
        },
      ]);

    if (error) {
      // console.error('Error creating event:', error);
      console.error('Supabase error details:', JSON.stringify(error, null, 2));
      setError('Failed to create event. Please try again.');
    } else {
      console.log('Event created successfully:', data);
      setSuccess(true);
      // Optionally clear form or redirect
      setTitle('');
      setBody('');
      setCategory('');
      setMediaUrl('');
      setLocation('');
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className={`text-4xl font-bold mb-4 text-white ${russoOne.className}`}>
        Create New <span className="text-[#7F5AF0]">Event</span>
      </h1>
      <p className={`text-lg text-gray-300 mb-8 ${spaceGroteskMed.className}`}>
        Fill out the details to create your JamSesh event.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-white mb-2">Title</label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 rounded bg-white/20 text-white border border-white/10" required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="body" className="text-white mb-2">Description</label>
          <textarea id="body" name="body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} className="p-2 rounded bg-white/20 text-white border border-white/10" required></textarea>
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
          {loading ? 'Creating...' : 'Create Event'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">Event created successfully!</p>}
      </form>
    </div>
  );
} 