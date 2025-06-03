"use client"
import localFont from 'next/font/local'

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/spaceGrotesk-Medium.ttf',
  display: 'swap',
});

export default function AllEvents() {
  return (
    <div className="p-8">
      <h1 className={`text-3xl font-bold mb-6 text-white ${russoOne.className}`}>
        All <span className="text-[#7F5AF0]">Events</span>
      </h1>
      <p className={`text-gray-300 ${spaceGroteskMed.className}`}>
        Your events will be listed here.
      </p>
    </div>
  )
} 