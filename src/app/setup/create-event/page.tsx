"use client";
import localFont from 'next/font/local';
import { useState, useRef } from 'react';
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
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    let uploadedPosterUrl = '';
    if (posterFile) {
      const cleanName = posterFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const filePath = `${user_id}/${Date.now()}-${cleanName}`;
      const { error: uploadError } = await supabase.storage
        .from('event-posters')
        .upload(filePath, posterFile, { upsert: true });
      if (uploadError) {
        setError(`Failed to upload poster: ${uploadError.message}${uploadError.details ? ' - ' + uploadError.details : ''}`);
        console.log(uploadError?.message, uploadError?.details);
        setLoading(false);
        return;
      }
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('event-posters')
        .getPublicUrl(filePath);
      uploadedPosterUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          user_id: user_id,
          title: title,
          body: body,
          category: category,
          media_url: uploadedPosterUrl || media_url,
          location: location 
        },
      ]);

    if (error) {
      console.error('Supabase error details:', JSON.stringify(error, null, 2));
      setError('Failed to create event. Please try again.');
    } else {
      setSuccess(true);
      setTitle('');
      setBody('');
      setCategory('');
      setMediaUrl('');
      setLocation('');
      setPosterFile(null);
      setPosterPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

    setLoading(false);
  };

  return (
    <div className="p-8 min-h-screen flex flex-col">
      <h1 className={`text-4xl font-bold mb-4 text-white ${russoOne.className}`}>
        Create New <span className="text-[#7F5AF0]">Event</span>
      </h1>
      <p className={`text-lg text-gray-300 mb-8 ${spaceGroteskMed.className}`}>
        Fill out the details to create your JamSesh event.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 shadow-xl"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-white mb-2">Title</label>
            <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 rounded bg-white/20 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#7F5AF0]" required />
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="body" className="text-white mb-2">Description</label>
            <textarea id="body" name="body" rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="p-3 rounded bg-white/20 text-white border border-white/10 resize-none focus:outline-none focus:ring-2 focus:ring-[#7F5AF0]" required></textarea>
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-2">Event Poster</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setPosterFile(e.target.files[0]);
                  setPosterPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="p-2 rounded bg-white/20 text-white border border-white/10"
              title="Upload event poster image"
              placeholder="Choose an image file"
            />
            {posterPreview && (
              <img src={posterPreview} alt="Poster Preview" className="mt-2 rounded-lg max-h-48 object-contain border border-white/20" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 justify-between">
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
            <input type="text" id="media_url" name="media_url" value={media_url} onChange={(e) => setMediaUrl(e.target.value)} className="p-3 rounded bg-white/20 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#7F5AF0]" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="location" className="text-white mb-2">Location</label>
            <input type="text" id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="p-3 rounded bg-white/20 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#7F5AF0]" />
          </div>
          <div className="flex flex-col mt-4">
            <button type="submit" className={`bg-[#7F5AF0] text-white p-3 rounded ${spaceGroteskMed.className} transition-colors hover:bg-[#6841c6]`} disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">Event created successfully!</p>}
          </div>
        </div>
      </form>
    </div>
  );
} 