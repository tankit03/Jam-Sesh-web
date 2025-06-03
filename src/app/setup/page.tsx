// pages/dashboard.tsx
"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import localFont from 'next/font/local'

const russoOne = localFont({
  src: '../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/auth/login')
      else setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="p-8">
      <h1 className={`text-3xl font-bold mb-6 text-white ${russoOne.className}`}>
        Welcome to your <span className="text-[#7F5AF0]">Dashboard</span>
      </h1>
      <p className={`text-gray-300 ${spaceGroteskMed.className}`}>
        Manage your events and collaborations from here.
      </p>
    </div>
  )
}
