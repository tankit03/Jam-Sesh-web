'use client'

import Link from 'next/link'
import localFont from 'next/font/local'

const russoOne = localFont({
  src: '../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#492B62] via-[#1E1E2C] via-[42%] via-[#39214D] via-[68%] to-[#1E1E25] to-[92%]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 ${russoOne.className}`}>
            Welcome to <span className="text-[#7F5AF0]">JamSesh</span>
          </h1>
          <p className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl ${spaceGroteskMed.className}`}>
            Your ultimate platform for music collaboration and discovery. Connect with artists, share your music, and create something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/signup"
              className={`px-8 py-3 rounded-lg bg-[#7F5AF0] text-white hover:bg-[#7F5AF0]/90 transition-colors duration-200 text-lg font-medium ${spaceGroteskMed.className}`}
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className={`px-8 py-3 rounded-lg border-2 border-[#7F5AF0] text-white hover:bg-[#7F5AF0]/10 transition-colors duration-200 text-lg font-medium ${spaceGroteskMed.className}`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
