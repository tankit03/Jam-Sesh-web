'use client'

import Link from 'next/link'
import Feed from '@/components/Feed'
import { useState } from 'react'

export default function HomePage() {
  const [location, setLocation] = useState('All')
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1333] text-white">
      <nav className="w-full flex gap-6 text-lg px-8 py-4 border-b border-[#3d00b6] bg-[#1a1333]">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/create-post">Create Post</Link>
      </nav>
      <main className="flex flex-col flex-1 w-full px-4">
        {/* Location Selector */}
        <div className="w-full max-w-2xl mx-auto pt-6 pb-4 flex items-center justify-center gap-3">
          <label htmlFor="location-select" className="text-lg font-medium">Location:</label>
          <select
            id="location-select"
            className="rounded bg-[#22203a] text-white px-4 py-2 border border-[#3d00b6] focus:outline-none"
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Portland">Portland</option>
            <option value="Seattle">Seattle</option>
            <option value="San Francisco">San Francisco</option>
          </select>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <Feed location={location} />
        </div>
      </main>
    </div>
  )
}
