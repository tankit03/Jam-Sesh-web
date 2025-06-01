import Link from 'next/link'

export default function CreatePostPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1333] text-white">
      <nav className="w-full flex gap-6 text-lg px-8 py-4 border-b border-[#3d00b6] bg-[#1a1333]">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/create-post">Create Post</Link>
      </nav>
      <main className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-2">Create Post Page</h1>
        <p className="text-gray-400">This is a blank create post page for Jam Sesh.</p>
      </main>
    </div>
  )
} 