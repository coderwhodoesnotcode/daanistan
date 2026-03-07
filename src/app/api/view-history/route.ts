import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');

    if (!startDate) {
      return NextResponse.json({ error: 'Missing startDate parameter' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('view_history')
      .select('*')
      .gte('recorded_at', startDate)
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('Error fetching view history:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}