import React from 'react';

export default function Modal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#22203a] rounded-lg shadow-xl p-6 relative w-full max-w-xl mx-4">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
    </div>
  );
} 