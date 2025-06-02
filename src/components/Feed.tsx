"use client"

import { useEffect, useState } from "react";
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

export default function Feed({ location = 'All' }: { location?: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="text-gray-400">Loading feed...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {posts.length === 0 ? (
        <div className="text-gray-400 italic text-center">No posts yet.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-[#22203a] rounded-lg p-6 shadow border border-[#3d00b6]/20">
            <div className="text-lg font-bold mb-1">{post.title}</div>
            <div className="text-xs text-gray-400 mb-1">by {post.profiles?.username || post.profiles?.email || 'Unknown'}</div>
            <div className="text-gray-300 mb-2">{post.body}</div>
            <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</div>
            {post.location && (
              <div className="text-xs text-[#3d00b6] mt-1">{post.location}</div>
            )}
          </div>
        ))
      )}
    </div>
  );
} 