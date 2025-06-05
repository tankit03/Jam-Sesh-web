"use client"
import { useEffect, useState, useRef, KeyboardEvent } from 'react'
import { supabase } from '@/lib/supabase'
import localFont from 'next/font/local'
import { FaCamera, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import EventCard from '../events/EventCard'

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  tags?: string[];
  bio?: string;
}

interface Event {
  id: string;
  title: string;
  body: string;
  category: string;
  thumbnail_url?: string;
  location: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [hostedEvents, setHostedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfileAndEvents()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id || null);
    });
  }, [])

  useEffect(() => {
    if (profile && isEditing) {
      setEditUsername(profile.username || '');
      setEditTags(profile.tags || []);
      setEditBio(profile.bio || '');
    }
  }, [profile, isEditing]);

  const fetchProfileAndEvents = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return setLoading(false)
    const userId = session.user.id
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    // Fetch hosted events
    const { data: eventsData } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setProfile(profileData)
    setHostedEvents(eventsData || [])
    setLoading(false)
  }

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    setUploading(true)
    const file = e.target.files[0]
    const { data: { session } } = await supabase.auth.getSession()
    if (!session || !profile) return setUploading(false)
    const userId = session.user.id
    const filePath = `${userId}/${file.name}`
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })
    if (uploadError) {
      alert('Upload failed!')
      setUploading(false)
      return
    }
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
    // Update profile
    await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', profile.id)
    setProfile({ ...profile, avatar_url: urlData.publicUrl })
    setUploading(false)
  }

  const handleEditProfile = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && value) {
      e.preventDefault();
      if (!editTags.includes(value)) {
        setEditTags([...editTags, value]);
      }
      e.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditTags(editTags.filter(t => t !== tag));
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    const tagsArray = editTags;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: editUsername, tags: tagsArray, bio: editBio })
      .eq('id', profile.id);
    if (updateError) {
      setError('Failed to update profile.');
      setSaving(false);
      return;
    }
    setProfile({ ...profile, username: editUsername, tags: tagsArray, bio: editBio });
    setIsEditing(false);
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-4 md:mb-8 items-start">
        <div className="relative group flex-shrink-0">
          <img
            src={profile?.avatar_url || '/default-avatar.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#7F5AF0] bg-gray-200"
          />
          <button
            className="absolute bottom-0 right-0 bg-[#7F5AF0] text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform"
            onClick={() => fileInputRef.current?.click()}
            title="Change profile picture"
            disabled={uploading}
          >
            <FaCamera />
          </button>
          <label htmlFor="profile-picture-upload" className="sr-only">Upload profile picture</label>
          <input
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            disabled={uploading}
          />
        </div>
        <div className="flex-1 w-full">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editUsername}
                onChange={e => setEditUsername(e.target.value)}
                className="text-2xl font-bold text-black mb-1 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-[#7F5AF0]"
                disabled={saving}
              />
              <div className="flex flex-wrap gap-2 mt-2 items-center">
                {editTags.map((tag) => (
                  <span key={tag} className="flex items-center px-3 py-1 rounded-full bg-[#23272F] text-white border border-[#7F5AF0] text-xs font-semibold mr-1">
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-[#7F5AF0] hover:text-red-500 focus:outline-none"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                      tabIndex={-1}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  ref={tagInputRef}
                  onKeyDown={handleTagInputKeyDown}
                  className="px-3 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:border-[#7F5AF0] bg-white text-black min-w-[80px]"
                  placeholder="Add tag"
                  disabled={saving}
                  aria-label="Add tag"
                />
              </div>
              <div className="mt-3">
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full min-h-[60px] rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#7F5AF0]"
                  placeholder="Write a short bio about yourself..."
                  disabled={saving}
                  maxLength={500}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  className="bg-[#7F5AF0] text-white px-4 py-1 rounded-lg text-sm font-semibold"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-1 rounded-lg text-sm font-semibold"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h2 className={`text-2xl font-bold text-white ${russoOne.className}`}>@{profile?.username}</h2>
                <button
                  className="ml-2 bg-[#7F5AF0] text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none"
                  onClick={handleEditProfile}
                  title="Edit Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(profile?.tags || []).map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#23272F] text-white border border-[#7F5AF0] text-xs font-semibold">{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mb-8">
        {isEditing ? (
          <textarea
            value={editBio}
            onChange={e => setEditBio(e.target.value)}
            className="w-full min-h-[60px] rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#7F5AF0]"
            placeholder="Write a short bio about yourself..."
            disabled={saving}
            maxLength={500}
          />
        ) : (
          profile?.bio && (
            <div className="mt-3 text-white text-sm whitespace-pre-line bg-white/10 rounded p-3 border border-white/10 max-w-xl">
              {profile.bio}
            </div>
          )
        )}
      </div>
      <div className="mb-10">
        <h3 className={`text-xl font-bold text-white mb-2 ${russoOne.className}`}>Hosted Events</h3>
        <p className={`text-gray-300 mb-4 ${spaceGroteskMed.className}`}>Events you've posted. Get ready to take center stage and shine in the spotlight!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostedEvents.length === 0 && <p className="text-gray-400">No hosted events yet.</p>}
          {hostedEvents.map(event => (
            <EventCard
              key={event.id}
              event={{ ...event, user_id: userId || '', profiles: { username: profile?.username || '' } }}
              currentUserId={userId}
              onEdit={ev => {/* Optionally handle edit here if needed */}}
            />
          ))}
        </div>
      </div>
    </div>
  )
}