'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1333] text-white">
      <nav className="w-full flex gap-6 text-lg px-8 py-4 border-b border-[#3d00b6] bg-[#1a1333]">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/create-post">Create Post</Link>
      </nav>
      <main className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-2">Profile Page</h1>
        <p className="text-gray-400 mb-4">Logged in as:</p>
        <div className="bg-[#22203a] px-6 py-3 rounded-lg text-lg font-mono">
          {user.email}
        </div>
      </main>
    </div>
  )
} 