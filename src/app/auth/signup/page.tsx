'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import localFont from 'next/font/local'

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',

});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long')
      return
    }

    try {
      await signUp(email, password, username)
      router.push('/setup')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#492B62] via-[#1E1E2C] via-[42%] via-[#39214D] via-[68%] to-[#1E1E25] to-[92%]">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl hover:shadow-[#7F5AF0]/20 transition-all duration-300">
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold text-white ${russoOne.className}`}>
            Let&apos;s get you started.
          </h2>
        </div>
        <form className={`mt-8 space-y-6 ${spaceGroteskMed.className}`} onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-t-md focus:outline-none focus:ring-[#7F5AF0] focus:border-[#7F5AF0] focus:z-10 sm:text-sm ${spaceGroteskMed.className}`}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 focus:outline-none focus:ring-[#7F5AF0] focus:border-[#7F5AF0] focus:z-10 sm:text-sm ${spaceGroteskMed.className}`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 focus:outline-none focus:ring-[#7F5AF0] focus:border-[#7F5AF0] focus:z-10 sm:text-sm ${spaceGroteskMed.className}`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-b-md focus:outline-none focus:ring-[#7F5AF0] focus:border-[#7F5AF0] focus:z-10 sm:text-sm ${spaceGroteskMed.className}`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className={`text-red-400 text-sm text-center ${spaceGroteskMed.className}`}>{error}</div>
          )}

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7F5AF0] hover:bg-[#7F5AF0]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F5AF0] transition-colors duration-200 ${spaceGroteskMed.className}`}
            >
              Sign up
            </button>
          </div>
        </form>

        <div className={`text-center ${spaceGroteskMed.className}`}>
          <Link
            href="/auth/login"
            className="text-[#7F5AF0] hover:text-[#7F5AF0]/80 transition-colors duration-200"
          >
            Already have an account? <span className="text-white">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 