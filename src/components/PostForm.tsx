import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import RichTextEditor from './RichTextEditor'

const postCategories = [
  { value: 'general', label: 'General' },
  { value: 'looking-for-musicians', label: 'Looking for Musicians' },
  { value: 'venue-available', label: 'Venue Available' },
  { value: 'lessons', label: 'Lessons' },
  { value: 'show-announcement', label: 'Show Announcement' },
  { value: 'promotion', label: 'Promotion' },
];

export default function PostForm({
  onSuccess,
  initialValues = {},
}: {
  onSuccess?: () => void,
  initialValues?: {
    id?: string
    title?: string
    body?: string
    category?: string
    // Add more fields as needed
  }
}) {
  const { user } = useAuth()
  const [title, setTitle] = useState(initialValues.title || '')
  const [body, setBody] = useState(initialValues.body || '')
  const [category, setCategory] = useState(initialValues.category || postCategories[0].value)
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
    let error;
    if (initialValues.id) {
      console.log('Attempting to update post with id:', initialValues.id);
      const { data, error: updateError } = await supabase.from('posts').update({
        title,
        body,
        category,
        // media_url: '',
      }).eq('id', initialValues.id);
      console.log('Update result:', data, updateError);
      error = updateError;
    } else {
      // Create new post
      ({ error } = await supabase.from('posts').insert([
        {
          title,
          body,
          category,
          user_id: user.id,
          // media_url: '',
        },
      ]));
    }
    setSubmitting(false)
    if (!error) {
      setShowSuccess(true)
      setTitle('')
      setBody('')
      setCategory(postCategories[0].value)
      setFile(null)
      setPreviewUrl(null)
      if (onSuccess) onSuccess()
    } else {
      alert('Error creating post: ' + error.message)
    }
  }

  return (
    <form
      className="w-full max-w-xl bg-[#22203a] rounded-lg p-8 shadow-lg flex flex-col gap-6"
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
      <RichTextEditor value={body} onChange={setBody} />
      <div>
        <label className="block mb-2 font-medium">Category</label>
        <select
          className="rounded bg-[#1a1333] text-white p-3 border border-[#3d00b6] focus:outline-none text-lg font-medium w-full"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          {postCategories.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
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
  )
} 