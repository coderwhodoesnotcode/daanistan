'use client';

import React, { useState, useEffect } from 'react';
import { Play, Eye, Loader2, Trophy, Database, Clock } from 'lucide-react';

export default function TopDramasTracker() {
  const [dramas, setDramas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0);
  const [playlistsFromDB, setPlaylistsFromDB] = useState<any[]>([]);

  // Get API keys and Supabase config from environment variables
  const API_KEYS = [
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_1,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_4,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_5,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_6,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_7,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_8
  ].filter(Boolean);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const getCurrentApiKey = () => API_KEYS[currentKeyIndex];

  // Fetch playlists from Supabase
  const fetchPlaylistsFromSupabase = async () => {
    try {
      console.log('Fetching playlists from Supabase...');
      
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase configuration missing. Please check environment variables.');
      }
      
      const baseUrl = SUPABASE_URL.endsWith('/') ? SUPABASE_URL.slice(0, -1) : SUPABASE_URL;
      
      const response = await fetch(`${baseUrl}/rest/v1/dramas?select=*`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Supabase response:', errorText);
        throw new Error(`Supabase error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Playlists from Supabase:', data);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No dramas found in Supabase table. Please add dramas to the "dramas" table.');
      }
      
      setPlaylistsFromDB(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching from Supabase:', err);
      throw err;
    }
  };

  const fetchPlaylistViews = async (playlistId: string, name: string) => {
    try {
      const API_KEY = getCurrentApiKey();
      let allVideoIds: string[] = []; 
      let nextPageToken = '';
      let thumbnail = '';

      do {
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
        
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
        if (data.error) throw new Error(data.error.message);
        
        if (!thumbnail && data.items && data.items.length > 0) {
          thumbnail = data.items[0].snippet.thumbnails.high?.url || 
                     data.items[0].snippet.thumbnails.medium?.url ||
                     data.items[0].snippet.thumbnails.default?.url;
        }
        
        const videoIds = data.items.map((item: any) => item.contentDetails.videoId);
        allVideoIds = [...allVideoIds, ...videoIds];
        
        nextPageToken = data.nextPageToken || '';
      } while (nextPageToken);

      let totalViews = 0;
      
      for (let i = 0; i < allVideoIds.length; i += 50) {
        const batch = allVideoIds.slice(i, i + 50);
        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${batch.join(',')}&key=${API_KEY}`;
        
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
        if (data.error) throw new Error(data.error.message);
        
        data.items.forEach((video: any) => {
          totalViews += parseInt(video.statistics.viewCount || 0);
        });
      }

      return {
        name,
        id: playlistId,
        views: totalViews,
        thumbnail: thumbnail || 'https://via.placeholder.com/480x360?text=No+Thumbnail',
        videoCount: allVideoIds.length
      };
    } catch (err: any) {
      console.error(`Error fetching ${name}:`, err);
      if (err.message === 'QUOTA_EXCEEDED') {
        throw err;
      }
      return null;
    }
  };

  const fetchAllDramas = async () => {
    try {
      setLoading(true);
      console.log(`Using API key ${currentKeyIndex + 1}/${API_KEYS.length}`);
      
      let playlists = playlistsFromDB;
      if (playlists.length === 0) {
        playlists = await fetchPlaylistsFromSupabase();
      }
      
      if (playlists.length === 0) {
        throw new Error('No playlists found in Supabase database');
      }
      
      console.log('Playlists from DB:', playlists);
      
      // Flatten playlists - each drama can have multiple playlist IDs
      const allPlaylistRequests: Array<{dramaName: string; playlistId: string}> = [];
      
      playlists.forEach((drama: any) => {
        // Check all three playlist columns (handles old 'playlist_id' or new 'playlist_id_1')
        const playlistId1 = drama.playlist_id_1 || drama.playlist_id; // Backward compatible
        
        if (playlistId1) {
          allPlaylistRequests.push({
            dramaName: drama.drama_name,
            playlistId: playlistId1
          });
        }
        if (drama.playlist_id_2) {
          allPlaylistRequests.push({
            dramaName: drama.drama_name,
            playlistId: drama.playlist_id_2
          });
        }
        if (drama.playlist_id_3) {
          allPlaylistRequests.push({
            dramaName: drama.drama_name,
            playlistId: drama.playlist_id_3
          });
        }
      });
      
      console.log('Total playlist requests:', allPlaylistRequests.length);
      console.log('Playlist requests:', allPlaylistRequests);
      
      if (allPlaylistRequests.length === 0) {
        throw new Error('No valid playlist IDs found in database');
      }
      
      const promises = allPlaylistRequests.map(item => 
        fetchPlaylistViews(item.playlistId, item.dramaName)
      );
      
      const results = await Promise.all(promises);
      console.log('Fetch results:', results);
      
      const validDramas = results.filter(d => d !== null);
      console.log('Valid dramas count:', validDramas.length);
      
      if (validDramas.length === 0) {
        throw new Error('No dramas could be fetched. Check API key or quota limits.');
      }
      
      // Combine playlists with same drama name
      const combinedDramas: Record<string, any> = {};
      
      validDramas.forEach((drama: any) => {
        if (combinedDramas[drama.name]) {
          // Drama already exists, add views and video count
          combinedDramas[drama.name].views += drama.views;
          combinedDramas[drama.name].videoCount += drama.videoCount;
          combinedDramas[drama.name].playlistCount += 1;
          // Keep the thumbnail from the first playlist
        } else {
          // New drama
          combinedDramas[drama.name] = {
            ...drama,
            playlistCount: 1
          };
        }
      });
      
      // Convert back to array and sort by views
      const sorted = Object.values(combinedDramas).sort((a: any, b: any) => b.views - a.views);
      
      console.log('Final sorted dramas:', sorted);
      
      setDramas(sorted);
      setLastUpdate(new Date());
      setError(null);
      setLoading(false);
    } catch (err: any) {
      console.error('Error in fetchAllDramas:', err);
      
      if (err.message === 'QUOTA_EXCEEDED' && currentKeyIndex < API_KEYS.length - 1) {
        console.log('Quota exceeded, switching to next API key...');
        setCurrentKeyIndex(prev => prev + 1);
        setError(`Switched to backup API key ${currentKeyIndex + 2}`);
        setTimeout(() => fetchAllDramas(), 2000);
      } else if (err.message === 'QUOTA_EXCEEDED') {
        setError('All API keys have exceeded quota. Please try again tomorrow.');
        setLoading(false);
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAllDramas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch real data every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllDramas();
    }, 900000); // 15 minutes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKeyIndex]);

  const formatViews = (views: number) => {
    if (views >= 1000000000) return `${(views / 1000000000).toFixed(2)}B`;
    if (views >= 1000000) return `${(views / 1000000).toFixed(2)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toLocaleString();
  };

  if (loading && dramas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700">Loading Top Pakistani Dramas...</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
            <Database className="w-4 h-4" />
            Fetching from Supabase database
          </p>
        </div>
      </div>
    );
  }

  if (error && dramas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllDramas}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="w-12 h-12 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
              Top Pakistani Dramas
            </h1>
          </div>
          <p className="text-gray-600 text-lg mb-3">
            Most viewed drama playlists on YouTube
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live • Updates every 15 minutes
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Database className="w-3 h-3" />
              API Key {currentKeyIndex + 1}/{API_KEYS.length}
            </div>
            {lastUpdate && (
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-red-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Thumbnail</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Drama Name</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Total Views</th>
                </tr>
              </thead>
              <tbody>
                {dramas.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Database className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-lg font-medium mb-2">No data available</p>
                        <button
                          onClick={fetchAllDramas}
                          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dramas.map((drama: any, index: number) => (
                  <tr 
                    key={drama.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'bg-amber-50' : 
                      index === 1 ? 'bg-gray-50' : 
                      index === 2 ? 'bg-orange-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <Trophy className={`w-5 h-5 ${
                            index === 0 ? 'text-amber-500' :
                            index === 1 ? 'text-gray-400' :
                            'text-orange-500'
                          }`} />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <img
                        src={drama.thumbnail}
                        alt={drama.name}
                        className="w-32 h-20 object-cover rounded-lg shadow-md"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/480x360?text=No+Thumbnail';
                        }}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">
                          {drama.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {drama.videoCount} episodes
                          {drama.playlistCount > 1 && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {drama.playlistCount} playlists
                            </span>
                          )}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Eye className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-800">
                            {formatViews(drama.views)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {drama.views.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Data refreshes automatically every 15 minutes
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Powered by Supabase • {playlistsFromDB.length} dramas tracked • Ranked by views • 8 API keys
          </p>
        </div>
      </div>
    </div>
  );
}