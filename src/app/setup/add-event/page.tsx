"use client"
import localFont from 'next/font/local'
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';

const russoOne = localFont({
  src: '../../../../fonts/RussoOne-Regular.ttf',
  display: 'swap',
});

const spaceGroteskMed = localFont({
  src: '../../../../fonts/SpaceGrotesk-Medium.ttf',
  display: 'swap',
});

export default function AddEvent() {
  return (
    <div className="p-8">
      <h1 className={`text-4xl font-bold mb-4 text-white ${russoOne.className}`}>
        Create a New <span className="text-[#7F5AF0]">Event</span>
      </h1>
      <p className={`text-lg text-gray-300 mb-8 ${spaceGroteskMed.className}`}>
        Plan your next JamSesh event.
      </p>

      <Link href="/setup/create-event">
        <div className="max-w-sm bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-colors cursor-pointer">
          <div className="border-2 border-dashed border-white/30 rounded-lg p-6 flex flex-col items-center justify-center text-center aspect-square">
            <FaPlus size={40} className="text-white/50 mb-4" />
            <p className={`text-xl text-white/50 ${spaceGroteskMed.className}`}>
              + NEW EVENT
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
} 