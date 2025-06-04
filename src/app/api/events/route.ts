import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      return NextResponse.json(
        { error: 'Authentication error', details: error.message },
        { status: 401 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch events created by the user, including their profile username
    const { data: events, error: eventsError } = await supabase
      .from('posts')
      .select('id, title, created_at, location, category, media_url, profiles(username)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (eventsError) {
      return NextResponse.json(
        { error: 'Error fetching events', details: eventsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(events || []);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error fetching events', details: error?.message || String(error) },
      { status: 500 }
    );
  }
} 