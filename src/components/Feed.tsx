"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Post = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, body, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

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
            <div className="text-gray-300 mb-2">{post.body}</div>
            <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
} 