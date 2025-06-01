'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isAvatarHovered, setIsAvatarHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bio, setBio] = useState('')
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bioDraft, setBioDraft] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isEditingTags, setIsEditingTags] = useState(false)
  const [tagsDraft, setTagsDraft] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [profileUsername, setProfileUsername] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      setProfileLoading(true)
      supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          setProfileUsername(data?.username || null)
          setProfileLoading(false)
        })
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a1333] text-white">
        <nav className="w-full flex gap-6 text-lg px-8 py-4 border-b border-[#3d00b6] bg-[#1a1333]">
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/create-post">Create Post</Link>
        </nav>
        <main className="flex flex-col items-center justify-center flex-1">
          <p className="text-gray-400">Loading...</p>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a1333] text-white">
        <nav className="w-full flex gap-6 text-lg px-8 py-4 border-b border-[#3d00b6] bg-[#1a1333]">
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/create-post">Create Post</Link>
        </nav>
        <main className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-3xl font-bold mb-2">Profile Page</h1>
          <p className="text-gray-400 mb-4">You are not logged in.</p>
          <button
            className="px-6 py-2 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] transition-colors"
            onClick={() => router.push('/auth/login')}
          >
            Log In / Sign Up
          </button>
        </main>
      </div>
    )
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (err) {
      setLoggingOut(false)
      alert('Error logging out')
    }
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
    }
  }

  const handlePostCreation = async (title: string, body: string) => {
    try {
      const { data, error } = await supabase.from('posts').insert([
        {
          title,
          body,
          user_id: user?.id,
        },
      ]).select()

      if (error) {
        console.error('Error creating post:', error.message)
        return
      }

      console.log('Post created successfully:', data)
      // Handle success
    } catch (err) {
      console.error('Error creating post:', err)
      // Handle error
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1333] text-white">
      <nav className="w-full flex gap-6 text-lg px-8 py-4 border-b border-[#3d00b6] bg-[#1a1333]">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/create-post">Create Post</Link>
      </nav>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xl py-8">
          <div
            className={`relative cursor-pointer transition-transform duration-200 ${isAvatarHovered ? 'scale-105' : ''}`}
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
            onClick={handleAvatarClick}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="w-28 h-28 rounded-full border-4 border-[#3d00b6] object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-[#3d00b6] bg-[#3d00b6] flex items-center justify-center text-3xl font-bold text-white">
                {(profileUsername || user.email)?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            {isAvatarHovered && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full shadow-lg shadow-[#3d00b6]/40 text-sm font-semibold text-white">
                Change
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="text-2xl font-bold">
            {profileLoading ? <span className="text-gray-400">Loading...</span> : (profileUsername || user.email)}
          </div>
          <div className="text-gray-400">{user.email}</div>
          <button
            className="px-6 py-2 rounded bg-[#ff3ec8] text-white hover:bg-[#ff3ec8]/80 transition-colors disabled:opacity-60 mt-2"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
        {/* Bio Section */}
        <div className="w-full max-w-xl bg-[#22203a] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Bio</div>
            {!isEditingBio && (
              <button
                className="flex items-center gap-1 px-3 py-1 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] text-xs font-medium shadow-sm transition-colors"
                onClick={() => { setBioDraft(bio); setIsEditingBio(true); }}
              >
                Edit
              </button>
            )}
          </div>
          {isEditingBio ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full rounded bg-[#1a1333] text-white p-2 border border-[#3d00b6]"
                rows={3}
                value={bioDraft}
                onChange={e => setBioDraft(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="px-4 py-1 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] text-sm"
                  onClick={() => { setBio(bioDraft); setIsEditingBio(false); }}
                >
                  Save
                </button>
                <button
                  className="px-4 py-1 rounded bg-gray-600 text-white hover:bg-gray-500 text-sm"
                  onClick={() => setIsEditingBio(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            bio.trim() ? (
              <div>{bio}</div>
            ) : (
              <div className="text-gray-400 italic">No bio yet.</div>
            )
          )}
        </div>
        {/* Tags Section */}
        <div className="w-full max-w-xl bg-[#22203a] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Tags</div>
            {!isEditingTags && (
              <button
                className="flex items-center gap-1 px-3 py-1 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] text-xs font-medium shadow-sm transition-colors"
                onClick={() => { setTagsDraft(tags); setIsEditingTags(true); }}
              >
                Edit
              </button>
            )}
          </div>
          {isEditingTags ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {tagsDraft.length === 0 ? (
                  <span className="text-gray-400 italic">No tags yet.</span>
                ) : (
                  tagsDraft.map((tag, idx) => (
                    <span key={tag} className="bg-[#3d00b6] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {tag}
                      <button
                        className="ml-1 text-xs text-white bg-[#ff3ec8] rounded-full w-4 h-4 flex items-center justify-center hover:bg-[#ff3ec8]/80"
                        onClick={() => setTagsDraft(tagsDraft.filter((_, i) => i !== idx))}
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  className="rounded bg-[#1a1333] text-white p-2 border border-[#3d00b6] text-sm"
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newTag.trim()) { setTagsDraft([...tagsDraft, newTag.trim()]); setNewTag(''); e.preventDefault(); } }}
                />
                <button
                  className="px-3 py-1 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] text-xs font-medium"
                  type="button"
                  onClick={() => { if (newTag.trim()) { setTagsDraft([...tagsDraft, newTag.trim()]); setNewTag(''); } }}
                >
                  Add
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-1 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] text-sm"
                  onClick={() => { setTags(tagsDraft); setIsEditingTags(false); }}
                >
                  Save
                </button>
                <button
                  className="px-4 py-1 rounded bg-gray-600 text-white hover:bg-gray-500 text-sm"
                  onClick={() => setIsEditingTags(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            tags.length === 0 ? (
              <div className="text-gray-400 italic">No tags yet.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-[#3d00b6] px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            )
          )}
        </div>
        {/* Post History Section */}
        <div className="w-full max-w-xl bg-[#22203a] rounded-lg p-6">
          <div className="font-semibold mb-2">Post History</div>
          <ul className="space-y-2">
            {/* Replace with actual posts from user */}
            <li className="border-b border-[#3d00b6]/30 pb-2 last:border-b-0">
              <div className="font-medium">Placeholder Post Title</div>
              <div className="text-xs text-gray-400">Placeholder Date</div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
} 