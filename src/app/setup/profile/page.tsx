"use client"
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import localFont from 'next/font/local'
import { FaCamera, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'

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
}

interface Event {
  id: string;
  title: string;
  body: string;
  category: string;
  media_url: string;
  location: string;
  created_at: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [hostedEvents, setHostedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfileAndEvents()
  }, [])

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

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
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
        <div>
          <h2 className={`text-2xl font-bold text-white mb-1 ${russoOne.className}`}>@{profile?.username}</h2>
          <button className="bg-[#7F5AF0] text-white px-4 py-1 rounded-lg text-sm font-semibold mb-2">Edit Profile</button>
          <div className="flex flex-wrap gap-2 mt-2">
            {(profile?.tags || []).map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-[#23272F] text-white border border-[#7F5AF0] text-xs font-semibold">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-10">
        <h3 className={`text-xl font-bold text-white mb-2 ${russoOne.className}`}>Hosted Events</h3>
        <p className={`text-gray-300 mb-4 ${spaceGroteskMed.className}`}>Events you've posted. Get ready to take center stage and shine in the spotlight!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostedEvents.length === 0 && <p className="text-gray-400">No hosted events yet.</p>}
          {hostedEvents.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center text-center gap-3">
              {event.media_url && (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 mx-auto mb-2">
                  <img src={event.media_url} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h4 className={`text-lg font-bold text-black mb-1 ${russoOne.className}`}>{event.title}</h4>
              <p className={`text-gray-800 mb-2 text-left ${spaceGroteskMed.className} break-words overflow-hidden`} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '3em', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{event.body.replace(/<[^>]+>/g, '')}</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 mb-1 items-center">
                <span className="flex items-center"><FaMapMarkerAlt className="mr-1" />{event.location}</span>
                <span className="flex items-center"><FaCalendarAlt className="mr-1" />{new Date(event.created_at).toLocaleDateString()}</span>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-black">{event.category.replace(/-/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 