"use client"

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export type Post = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  location?: string;
  profiles?: {
    username?: string;
    email?: string;
  };
};

export default function Feed({ location = 'All', onEditPost }: { location?: string, onEditPost?: (post: any) => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      let query = supabase
        .from("posts")
        .select("id, title, body, created_at, location, profiles(username, email)")
        .order("created_at", { ascending: false });
      if (location && location !== 'All') {
        query = query.eq('location', location);
      }
      const { data, error } = await query;
      if (error) {
        setError(error.message);
      } else {
        const normalized = (data || []).map((post: any) => ({
          ...post,
          profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
        }));
        setPosts(normalized);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [location]);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    }
    if (menuOpenId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenId]);

  const handleDelete = async (postId: string) => {
    setDeleting(true);
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    setDeleting(false);
    setDeleteConfirmId(null);
    setMenuOpenId(null);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } else {
      alert('Error deleting post: ' + error.message);
    }
  };

  if (loading) return <div className="text-gray-400">Loading feed...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {posts.length === 0 ? (
        <div className="text-gray-400 italic text-center">No posts yet.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-[#22203a] rounded-lg p-6 shadow border border-[#3d00b6]/20 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-bold mb-1">{post.title}</div>
                <div className="text-xs text-gray-400 mb-1">by {post.profiles?.username || post.profiles?.email || 'Unknown'}</div>
              </div>
              <div className="relative" ref={menuOpenId === post.id ? menuRef : null}>
                <button
                  className="p-2 rounded-full hover:bg-[#3d00b6]/20 focus:outline-none"
                  onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                  aria-label="Post options"
                >
                  <span className="text-2xl text-gray-400">&#x22EE;</span>
                </button>
                {menuOpenId === post.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#1a1333] border border-[#3d00b6]/40 rounded shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3d00b6]/30"
                      onClick={() => { if (onEditPost) onEditPost(post); setMenuOpenId(null); }}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#ff3ec8]/20"
                      onClick={() => { setDeleteConfirmId(post.id); setMenuOpenId(null); }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Custom styles for links in post body */}
            <style>{`
              .post-body a {
                color: #7F5AF0;
                font-weight: 600;
                text-decoration: underline;
                transition: color 0.2s;
              }
              .post-body a:hover {
                color: #ff3ec8;
              }
            `}</style>
            {/* Render rich text HTML for post body */}
            {/* eslint-disable-next-line react/no-danger */}
            <div className="text-gray-300 mb-2 post-body" dangerouslySetInnerHTML={{ __html: post.body }} />
            <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</div>
            {post.location && (
              <div className="text-xs text-[#3d00b6] mt-1">{post.location}</div>
            )}
            {/* Delete Confirmation Popup */}
            {deleteConfirmId === post.id && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                <div className="bg-[#22203a] border border-[#3d00b6] rounded-lg p-8 shadow-xl flex flex-col items-center">
                  <h2 className="text-xl font-bold mb-2 text-[#ff3ec8]">Delete Post?</h2>
                  <p className="mb-4 text-gray-200">Are you sure you want to delete this post?</p>
                  <div className="flex gap-4">
                    <button
                      className="px-6 py-2 rounded bg-[#ff3ec8] text-white hover:bg-[#ff3ec8]/80 transition-colors font-semibold disabled:opacity-60"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      className="px-6 py-2 rounded bg-[#3d00b6] text-white hover:bg-[#7F5AF0] transition-colors font-semibold"
                      onClick={() => setDeleteConfirmId(null)}
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
} 