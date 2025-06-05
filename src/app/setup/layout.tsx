"use client"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import localFont from 'next/font/local'
import { FaMusic, FaMapMarkedAlt, FaListUl, FaPlus, FaUser, FaSignOutAlt } from 'react-icons/fa'

const russoOne = localFont({
  src: '../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

interface SidebarProps {
  isMinimized: boolean;
  toggleMinimize: () => void;
}

function Sidebar({ isMinimized, toggleMinimize }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsername = async () => {
      const { data: { session } = { session: null } } = await supabase.auth.getSession() // Destructure with default value
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          setUsername('Error')
          setAvatarUrl(null)
        } else if (data) {
          setUsername(data.username)
          setAvatarUrl(data.avatar_url)
        } else {
          setUsername('No Username')
          setAvatarUrl(null)
        }
      } else {
        setUsername('Guest')
        setAvatarUrl(null)
      }
      setLoading(false)
    }

    fetchUsername()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const isActive = (href: string) => pathname === href;

  if (loading) {
    return (
      <div className="h-screen w-64 bg-[#23272F] text-white p-6 flex flex-col items-center justify-center">
        <p className={`${spaceGroteskMed.className}`}>Loading...</p>
      </div>
    )
  }

  return (
    <div className={`fixed left-0 top-0 h-screen z-30 ${isMinimized ? 'w-20' : 'w-64'} bg-[#23272F] text-white flex flex-col transition-all duration-300 ease-in-out border-r border-white/20 p-6`}>
      <div className={`flex mb-6 ${isMinimized ? 'flex-col items-center' : 'flex-row justify-between items-center'}`}>
        {/* Close Button */}
        <button 
          onClick={toggleMinimize}
          className="text-white text-2xl font-bold leading-none hover:text-gray-300 transition-colors duration-200"
        >
          {isMinimized ? '→' : '×'}{/* Change icon based on state */}
        </button>
        {isMinimized ? (
          <FaMusic size={28} className="text-[#7F5AF0] mt-2" />
        ) : (
          <div className={`text-2xl font-bold ${russoOne.className}`}>
            <span className="text-[#7F5AF0]">Jam</span>Sesh
          </div>
        )}
      </div>
      
      {/* Profile Section */}
      <div className={`flex items-center mb-6 pb-6 border-b border-white/20 ${spaceGroteskMed.className}`}>
        {/* Profile Picture */}
        <img
          src={avatarUrl || '/default-avatar.png'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0 bg-gray-500 border-2 border-[#7F5AF0]"
        />
        {!isMinimized && (
          <span className="text-lg font-semibold truncate">{username}</span> // Truncate long usernames
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-4 ${russoOne.className}`}>
        <Link 
          href="/setup/maps" 
          className={`${isMinimized ? 'flex justify-center items-center py-3' : 'block py-3 px-4 text-left'} rounded-lg transition-colors duration-200 text-lg ${isActive('/setup/maps') ? 'bg-[#7F5AF0] text-white' : 'hover:bg-white/10'}`}
        >
          {isMinimized ? <FaMapMarkedAlt size={22} /> : 'Event Maps'}
        </Link>
        <Link 
          href="/setup/events" 
          className={`${isMinimized ? 'flex justify-center items-center py-3' : 'block py-3 px-4 text-left'} rounded-lg transition-colors duration-200 text-lg ${isActive('/setup/events') ? 'bg-[#7F5AF0] text-white' : 'hover:bg-white/10'}`}
        >
          {isMinimized ? <FaListUl size={22} /> : 'All Events'}
        </Link>
        <Link 
          href="/setup/add-event" 
          className={`${isMinimized ? 'flex justify-center items-center py-3' : 'block py-3 px-4 text-left'} rounded-lg transition-colors duration-200 text-lg ${isActive('/setup/add-event') ? 'bg-[#7F5AF0] text-white' : 'hover:bg-white/10'}`}
        >
          {isMinimized ? <FaPlus size={22} /> : 'My Events'}
        </Link>
        <Link 
          href="/setup/profile" 
          className={`${isMinimized ? 'flex justify-center items-center py-3' : 'block py-3 px-4 text-left'} rounded-lg transition-colors duration-200 text-lg ${isActive('/setup/profile') ? 'bg-[#7F5AF0] text-white' : 'hover:bg-white/10'}`}
        >
          {isMinimized ? <FaUser size={22} /> : 'Profile'}
        </Link>
      </nav>
      
      {/* Logout Button at the bottom */}
      <div className={`${russoOne.className}`}>
        <button
          onClick={handleLogout}
          className={`w-full hover:bg-white/10 rounded-lg transition-colors duration-200 text-lg ${isMinimized ? 'flex justify-center items-center py-3' : 'block py-3 px-4 text-left'}`}
        >
          {isMinimized ? <FaSignOutAlt size={22} /> : 'Logout'}
        </button>
      </div>
    </div>
  )
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } = { session: null } } = await supabase.auth.getSession() // Destructure with default value
      if (!session) router.push('/auth/login')
      else setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-[#492B62] via-[#1E1E2C] via-[42%] via-[#39214D] via-[68%] to-[#1E1E25] to-[92%] flex items-center justify-center">
      <p className={`text-white ${spaceGroteskMed.className}`}>Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#492B62] via-[#1E1E2C] via-[42%] via-[#39214D] via-[68%] to-[#1E1E25] to-[92%] flex">
      <Sidebar isMinimized={isSidebarMinimized} toggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)} />
      <main className={`flex-1 p-4 pt-14 transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'ml-20' : 'ml-64'}`}>{/* Main content now has left margin */}
        {children}
      </main>
    </div>
  )
}