"use client"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import localFont from 'next/font/local'
import { FaMap, FaSearch, FaPlus, FaUser, FaSignOutAlt } from 'react-icons/fa';

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsername = async () => {
      const { data: { session } = { session: null } } = await supabase.auth.getSession() // Destructure with default value
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching username:', error)
          setUsername('Error') // Display an error or default
        } else if (data) {
          setUsername(data.username)
        } else {
          setUsername('No Username') // Handle case where no profile is found
        }
      } else {
        setUsername('Guest')
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
      <div className="h-screen w-64 bg-[#1E1E2C] text-white p-6 flex flex-col items-center justify-center">
        <p className={`${spaceGroteskMed.className}`}>Loading...</p>
      </div>
    )
  }

  return (
    <div className={`h-full ${isMinimized ? 'w-20 items-center' : 'w-64'} bg-white/10 backdrop-blur-lg text-white p-6 flex flex-col transition-all duration-300 ease-in-out rounded-xl border border-white/20`}>
      <div className={`flex ${isMinimized ? 'justify-center' : 'justify-between'} items-center mb-6`}>
        {/* Close Button */}
        <button 
          onClick={toggleMinimize}
          className="text-white text-2xl font-bold leading-none hover:text-gray-300 transition-colors duration-200"
        >
          {isMinimized ? '→' : '×'}{/* Change icon based on state */}
        </button>
        {!isMinimized && ( // Hide logo when minimized
          <div className={`text-2xl font-bold ${russoOne.className}`}>
             <span className="text-[#7F5AF0]">Jam</span>Sesh
          </div>
        )}
      </div>
      
      {/* Profile Section */}
      <div className={`flex items-center ${isMinimized ? 'justify-center flex-col text-center' : ''} mb-6 pb-6 border-b border-white/20 ${spaceGroteskMed.className}`}>
        {/* Placeholder for Profile Picture */}
        <div className="w-10 h-10 bg-gray-500 rounded-full ${isMinimized ? 'mb-2' : 'mr-3'} flex-shrink-0"></div>
        {!isMinimized && (
          <span className="text-lg font-semibold truncate">{username}</span> // Truncate long usernames
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-4 ${russoOne.className}`}>
        <Link 
          href="/setup/maps" 
          className={`flex items-center ${isMinimized ? 'justify-center' : ''} py-3 px-4 rounded-lg transition-colors duration-200 text-lg ${isActive('/setup/maps') ? 'bg-[#7F5AF0] text-white' : 'hover:bg-white/10'}`}
        >
          {isMinimized ? <FaMap size={24} /> : 'Event Maps'}{/* Icon when minimized */}
        </Link>
        <Link 
          href="/setup/events" 
          className={`flex items-center ${isMinimized ? 'justify-center' : ''} py-3 px-4 rounded-lg transition-colors duration-200 text-lg ${isActive('/setup/events') ? 'bg-[#7F5AF0] text-white' : 'hover:bg-white/10'}`}
        >
          {isMinimized ? <FaSearch size={24} /> : 'All Events'}{/* Icon when minimized */}
        </Link>
        <Link 
          href="/setup/add-event" 
          className={`flex items-center ${isMinimized ? 'justify-center' : ''} py-3 px-4 rounded-lg transition-colors duration-200 text-lg ${isActive('/setup/add-event') ? 'bg-[#7F5AF0] text-white' : 'hover:bg-white/10'}`}
        >
          {isMinimized ? <FaPlus size={24} /> : 'Add Events'}{/* Icon when minimized */}
        </Link>
        <Link 
          href="/setup/profile" 
          className={`flex items-center ${isMinimized ? 'justify-center' : ''} py-3 px-4 rounded-lg transition-colors duration-200 text-lg ${isActive('/setup/profile') ? 'bg-[#7F5AF0] text-white' : 'hover:bg-white/10'}`}
        >
          {isMinimized ? <FaUser size={24} /> : 'Profile'}{/* Icon when minimized */}
        </Link>
      </nav>
      
      {/* Logout Button at the bottom */}
      <div className={`${russoOne.className}`}>
        <button
          onClick={handleLogout}
          className={`w-full text-left py-3 px-4 hover:bg-white/10 rounded-lg transition-colors duration-200 text-lg ${isMinimized ? 'flex justify-center' : ''}`}
        >
          {isMinimized ? <FaSignOutAlt size={24} /> : 'Logout'}{/* Icon when minimized */}
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
    <div className="min-h-screen bg-gradient-to-b from-[#492B62] via-[#1E1E2C] via-[42%] via-[39214D] via-[68%] to-[#1E1E25] to-[92%] flex items-center justify-center">
      <p className={`text-white ${spaceGroteskMed.className}`}>Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#492B62] via-[#1E1E2C] via-[42%] via-[39214D] via-[68%] to-[#1E1E25] to-[92%] flex p-4">
      <Sidebar isMinimized={isSidebarMinimized} toggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)} />
      <main className={`flex-1 ${isSidebarMinimized ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out`}>{/* Adjust margin based on sidebar width */}
        {children}
      </main>
    </div>
  )
}