"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import localFont from 'next/font/local'
import { User } from '@supabase/supabase-js'

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
      }
    }

    getUser()
  }, [])

  return (
    <div className="p-8">
      <h1 className={`text-3xl font-bold mb-6 text-white ${russoOne.className}`}>
        Your <span className="text-[#7F5AF0]">Profile</span>
      </h1>
      {user && (
        <div className={`space-y-4 text-gray-300 ${spaceGroteskMed.className}`}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}</p>
        </div>
      )}
    </div>
  )
} 