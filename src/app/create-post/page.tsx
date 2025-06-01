'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function CreatePostPage() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    setFile(f || null)
    if (f) {
      setPreviewUrl(URL.createObjectURL(f))
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('You must be logged in to create a post.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('posts').insert([
      {
        title,
        body,
        user_id: user.id,
        // media_url: '',
      },
    ])
    setSubmitting(false)
    if (!error) {
      setShowSuccess(true)
      setTitle('')
      setBody('')
      setFile(null)
      setPreviewUrl(null)
    } else {
      alert('Error creating post: ' + error.message)
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
        <form
          className="w-full max-w-xl bg-[#22203a] rounded-lg p-8 shadow-lg flex flex-col gap-6 mt-8"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold mb-2">Create a Post</h1>
          <input
            className="rounded bg-[#1a1333] text-white p-3 border border-[#3d00b6] focus:outline-none text-lg font-medium"
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={120}
            required
          />
          <textarea
            className="rounded bg-[#1a1333] text-white p-3 border border-[#3d00b6] focus:outline-none min-h-[120px]"
            placeholder="Body (optional)"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
          />
          <div>
            <label className="block mb-2 font-medium">Image or Attachment</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? 'Change File' : 'Add File'}
              </button>
              {file && (
                <span className="text-sm text-gray-300">{file.name}</span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.mp3,.wav"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-4 max-h-48 rounded border border-[#3d00b6]"
              />
            )}
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 rounded bg-[#ff3ec8] text-white hover:bg-[#ff3ec8]/80 transition-colors text-lg font-bold disabled:opacity-60"
            disabled={submitting || !title.trim()}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-[#22203a] border border-[#3d00b6] rounded-lg p-8 shadow-xl flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-[#3d00b6]">Post Created!</h2>
              <p className="mb-4 text-gray-200">Your post has been submitted successfully.</p>
              <button
                className="px-6 py-2 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] transition-colors font-semibold"
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 