import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const API_KEYS = [
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_1,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_4,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_5,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_6,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_7,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_8
].filter(Boolean) as string[];

let currentKeyIndex = 0;

async function fetchPlaylistViews(playlistId: string, apiKey: string) {
  try {
    let allVideoIds: string[] = [];
    let nextPageToken = '';
    let thumbnail = '';

    // Fetch all videos from playlist
    do {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      
      const response = await fetch(playlistUrl);
      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
            throw new Error('QUOTA_EXCEEDED');
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get thumbnail
      if (!thumbnail && data.items && data.items.length > 0) {
        for (const item of data.items) {
          if (item.snippet?.thumbnails) {
            thumbnail = item.snippet.thumbnails.maxres?.url ||
                       item.snippet.thumbnails.high?.url || 
                       item.snippet.thumbnails.medium?.url ||
                       item.snippet.thumbnails.default?.url ||
                       item.snippet.thumbnails.standard?.url;
            if (thumbnail) break;
          }
        }
      }
      
      const videoIds = data.items.map((item: any) => item.contentDetails.videoId);
      allVideoIds = [...allVideoIds, ...videoIds];
      
      nextPageToken = data.nextPageToken || '';
    } while (nextPageToken);

    // Fetch view counts in batches of 50
    let totalViews = 0;
    
    for (let i = 0; i < allVideoIds.length; i += 50) {
      const batch = allVideoIds.slice(i, i + 50);
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${batch.join(',')}&key=${apiKey}`;
      
      const response = await fetch(videoUrl);
      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
            throw new Error('QUOTA_EXCEEDED');
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      data.items.forEach((video: any) => {
        totalViews += parseInt(video.statistics.viewCount || 0);
      });
    }

    return {
      views: totalViews,
      videoCount: allVideoIds.length,
      thumbnail: thumbnail || 'https://via.placeholder.com/480x360?text=No+Thumbnail'
    };
  } catch (err: any) {
    throw err;
  }
}

export async function GET(request: Request) {
//   // Optional: Add authentication
//   const authHeader = request.headers.get('authorization');
//   const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
  
//   if (authHeader !== `Bearer ${cronSecret}`) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

  try {
    console.log('Starting drama data update...');

    // Fetch all dramas from Supabase
    const dramasResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/dramas?select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      }
    );

    if (!dramasResponse.ok) {
      throw new Error('Failed to fetch dramas from Supabase');
    }

    const dramas = await dramasResponse.json();
    console.log(`Found ${dramas.length} dramas to update`);

    const updatedDramas = [];

    // Process each drama
    for (const drama of dramas) {
      try {
        const playlistIds = [
          drama.playlist_id_1 || drama.playlist_id,
          drama.playlist_id_2,
          drama.playlist_id_3
        ].filter(Boolean);

        if (playlistIds.length === 0) {
          console.log(`Skipping ${drama.drama_name} - no playlist IDs`);
          continue;
        }

        let combinedViews = 0;
        let combinedVideoCount = 0;
        let thumbnail = '';

        // Fetch data for each playlist
        for (const playlistId of playlistIds) {
          let success = false;
          
          // Try with current API key, rotate if quota exceeded
          while (currentKeyIndex < API_KEYS.length && !success) {
            try {
              const data = await fetchPlaylistViews(playlistId, API_KEYS[currentKeyIndex]);
              combinedViews += data.views;
              combinedVideoCount += data.videoCount;
              if (!thumbnail) thumbnail = data.thumbnail;
              success = true;
              console.log(`✓ ${drama.drama_name} - Playlist ${playlistId}: ${data.views} views`);
            } catch (err: any) {
              if (err.message === 'QUOTA_EXCEEDED') {
                console.log(`Quota exceeded for API key ${currentKeyIndex + 1}, switching...`);
                currentKeyIndex++;
              } else {
                throw err;
              }
            }
          }

          if (!success) {
            throw new Error('All API keys quota exceeded');
          }
        }

        // Update drama in Supabase
        const updateResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/dramas?id=eq.${drama.id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_ANON_KEY!,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              total_views: combinedViews,
              total_videos: combinedVideoCount,
              thumbnail: thumbnail,
              playlist_count: playlistIds.length,
              last_updated: new Date().toISOString()
            })
          }
        );

        if (!updateResponse.ok) {
          throw new Error(`Failed to update drama ${drama.drama_name}`);
        }

        // Insert into view_history
        await fetch(
          `${SUPABASE_URL}/rest/v1/view_history`,
          {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY!,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              drama_name: drama.drama_name,
              views: combinedViews,
              recorded_at: new Date().toISOString()
            })
          }
        );

        updatedDramas.push({
          name: drama.drama_name,
          views: combinedViews,
          videos: combinedVideoCount
        });

      } catch (err: any) {
        console.error(`Error updating ${drama.drama_name}:`, err.message);
      }
    }

    console.log(`Successfully updated ${updatedDramas.length} dramas`);

    return NextResponse.json({
      success: true,
      updated: updatedDramas.length,
      dramas: updatedDramas,
      apiKeyUsed: currentKeyIndex + 1
    });

  } catch (error: any) {
    console.error('Error updating dramas:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}