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

export default function AddEvent() {
  return (
    <div className="p-8">
      <h1 className={`text-3xl font-bold mb-6 text-white ${russoOne.className}`}>
        Add New <span className="text-[#7F5AF0]">Event</span>
      </h1>
      <p className={`text-gray-300 ${spaceGroteskMed.className}`}>
        Form to add new events will be displayed here.
      </p>
    </div>
  )
} 