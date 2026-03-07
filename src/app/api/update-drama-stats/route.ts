import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const YOUTUBE_API_KEYS = [
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_1,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_4,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_5,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_6,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_7,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_8,
].filter(Boolean) as string[];

let currentKeyIndex = 0;

function getNextApiKey(): string | null {
  if (currentKeyIndex >= YOUTUBE_API_KEYS.length) {
    return null;
  }
  const key = YOUTUBE_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % YOUTUBE_API_KEYS.length;
  return key;
}

async function fetchPlaylistData(playlistId: string): Promise<{
  views: number;
  videoCount: number;
  thumbnail: string;
} | null> {
  if (!playlistId || playlistId === 'NULL') return null;

  try {
    const apiKey = getNextApiKey();
    if (!apiKey) throw new Error('No API keys available');

    let allVideoIds: string[] = [];
    let nextPageToken = '';
    let thumbnail = '';

    // Fetch all videos from playlist
    do {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50${
        nextPageToken ? `&pageToken=${nextPageToken}` : ''
      }`;

      const response = await fetch(playlistUrl, { next: { revalidate: 0 } });

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
            throw new Error('QUOTA_EXCEEDED');
          }
        }
        return null;
      }

      const data = await response.json();

      // Get thumbnail
      if (!thumbnail && data.items?.length > 0) {
        for (const item of data.items) {
          if (item.snippet?.thumbnails) {
            thumbnail =
              item.snippet.thumbnails.maxres?.url ||
              item.snippet.thumbnails.high?.url ||
              item.snippet.thumbnails.medium?.url ||
              item.snippet.thumbnails.default?.url ||
              '';
            if (thumbnail) break;
          }
        }
      }

      const videoIds = data.items?.map((item: any) => item.contentDetails.videoId) || [];
      allVideoIds = [...allVideoIds, ...videoIds];
      nextPageToken = data.nextPageToken || '';
    } while (nextPageToken);

    // Fetch view counts for all videos
    let totalViews = 0;
    for (let i = 0; i < allVideoIds.length; i += 50) {
      const batch = allVideoIds.slice(i, i + 50);
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${batch.join(
        ','
      )}&key=${apiKey}`;

      const response = await fetch(videoUrl, { next: { revalidate: 0 } });

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
            throw new Error('QUOTA_EXCEEDED');
          }
        }
        continue;
      }

      const data = await response.json();
      data.items?.forEach((video: any) => {
        totalViews += parseInt(video.statistics?.viewCount || '0');
      });
    }

    return {
      views: totalViews,
      videoCount: allVideoIds.length,
      thumbnail: thumbnail || 'https://via.placeholder.com/480x360?text=No+Thumbnail',
    };
  } catch (err: any) {
    if (err.message === 'QUOTA_EXCEEDED') {
      throw err;
    }
    console.error(`Error fetching playlist ${playlistId}:`, err);
    return null;
  }
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('🚀 Starting drama stats update...');
  const startTime = Date.now();

  try {
    // Fetch all dramas from Supabase
    const { data: dramas, error } = await supabase
      .from('dramas')
      .select('id, drama_name, playlist_id_1, playlist_id_2, playlist_id_3');

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }

    console.log(`📊 Fetched ${dramas.length} dramas`);

    // Process dramas in batches
    const batchSize = 5;
    let successCount = 0;

    for (let i = 0; i < dramas.length; i += batchSize) {
      const batch = dramas.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (drama) => {
          try {
            // Fetch data for all playlists in parallel
            const [data1, data2, data3] = await Promise.all([
              fetchPlaylistData(drama.playlist_id_1),
              fetchPlaylistData(drama.playlist_id_2),
              fetchPlaylistData(drama.playlist_id_3),
            ]);

            // Combine results
            let totalViews = 0;
            let totalVideoCount = 0;
            let playlistCount = 0;
            let thumbnail = 'https://via.placeholder.com/480x360?text=No+Thumbnail';

            [data1, data2, data3].forEach((data) => {
              if (data) {
                totalViews += data.views;
                totalVideoCount += data.videoCount;
                playlistCount++;
                if (!thumbnail.includes('placeholder') && data.thumbnail) {
                  thumbnail = data.thumbnail;
                }
              }
            });

            console.log(`✅ ${drama.drama_name}: ${totalViews.toLocaleString()} views`);

            // Update the drama row
            const { error: updateError } = await supabase
              .from('dramas')
              .update({
                total_views: totalViews,
                video_count: totalVideoCount,
                playlist_count: playlistCount,
                thumbnail: thumbnail,
                last_updated: new Date().toISOString(),
              })
              .eq('id', drama.id);

            if (updateError) {
              console.error(`❌ Error updating ${drama.drama_name}:`, updateError);
            } else {
              successCount++;
              
              // Save to view_history table for tracking
              await supabase.from('view_history').insert({
                drama_name: drama.drama_name,
                views: totalViews,
                recorded_at: new Date().toISOString(),
              });
            }
          } catch (error) {
            console.error(`❌ Error processing ${drama.drama_name}:`, error);
          }
        })
      );

      // Small delay between batches
      if (i + batchSize < dramas.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`🎉 Updated ${successCount}/${dramas.length} dramas in ${duration}s`);

    return NextResponse.json({
      success: true,
      updated: successCount,
      total: dramas.length,
      duration: `${duration}s`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to update stats', details: String(error) },
      { status: 500 }
    );
  }
}