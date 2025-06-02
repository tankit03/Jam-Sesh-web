'use client'

import Link from 'next/link'
import Feed from '@/components/Feed'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const cityOptions = [
  { value: 'Portland', label: 'Portland' },
  { value: 'Seattle', label: 'Seattle' },
  { value: 'San Francisco', label: 'San Francisco' },
  { value: 'Los Angeles', label: 'Los Angeles' },
  // ...add more as needed
]
type OptionType = { value: string; label: string };

const Select = dynamic(() => import('react-select'), { ssr: false })

export default function HomePage() {
  const [location, setLocation] = useState('')
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
          <div className="flex-1 min-w-[200px]">
            <Select
              inputId="location-select"
              options={cityOptions}
              value={cityOptions.find(opt => opt.value === location) || null}
              onChange={(newValue) => {
                const opt = newValue as OptionType | null;
                setLocation(opt ? opt.value : '');
              }}
              isClearable
              placeholder="Type a city..."
              classNamePrefix="react-select"
              styles={{
                control: (base: any) => ({
                  ...base,
                  backgroundColor: '#22203a',
                  borderColor: '#3d00b6',
                  color: 'white',
                }),
                singleValue: (base: any) => ({
                  ...base,
                  color: 'white',
                }),
                menu: (base: any) => ({
                  ...base,
                  backgroundColor: '#22203a',
                  color: 'white',
                }),
              }}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <Feed location={location || 'All'} />
        </div>
      </main>
    </div>
  )
}
