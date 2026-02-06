'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Eye, Loader2, Trophy, Database, Clock, TrendingUp } from 'lucide-react';

type TimePeriod = '24h' | 'week' | 'month' | 'alltime';

interface ViewRecord {
  drama_name: string;
  views: number;
  recorded_at: string;
}

interface Drama {
  name: string;
  id: string;
  views: number;
  thumbnail: string;
  videoCount: number;
  playlistCount: number;
  viewGrowth: number;
  previousViews: number;
}

const TopDramasTracker: React.FC = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0);
  const [playlistsFromDB, setPlaylistsFromDB] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('alltime');

  // Use ref to track if initial fetch is done
  const initialFetchDone = useRef(false);

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
  ].filter(Boolean) as string[];

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const getCurrentApiKey = () => {
    if (currentKeyIndex >= API_KEYS.length) {
      return null;
    }
    return API_KEYS[currentKeyIndex];
  };

  // Fetch playlists from Supabase
  const fetchPlaylistsFromSupabase = async () => {
    try {
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
        throw new Error(`Supabase error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No dramas found in Supabase table. Please add dramas to the "dramas" table.');
      }
      
      setPlaylistsFromDB(data);
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  // Save current view counts to Supabase
  const saveViewCounts = async (dramaData: Drama[]) => {
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return;
      }
      
      const baseUrl = SUPABASE_URL.endsWith('/') ? SUPABASE_URL.slice(0, -1) : SUPABASE_URL;
      
      const records = dramaData.map(drama => ({
        drama_name: drama.name,
        views: drama.views,
        recorded_at: new Date().toISOString()
      }));

      await fetch(`${baseUrl}/rest/v1/view_history`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(records)
      });
    } catch (err: any) {
      // Silently fail - view history is optional
    }
  };

  // Fetch historical data for ranking calculations
  const fetchHistoricalData = async (period: TimePeriod): Promise<Map<string, number>> => {
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || period === 'alltime') {
        return new Map();
      }
      
      const baseUrl = SUPABASE_URL.endsWith('/') ? SUPABASE_URL.slice(0, -1) : SUPABASE_URL;
      
      // Calculate the timestamp for the period
      const now = new Date();
      let periodStart: Date;
      
      switch (period) {
        case '24h':
          periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          return new Map();
      }

      const response = await fetch(
        `${baseUrl}/rest/v1/view_history?select=*&recorded_at=gte.${periodStart.toISOString()}&order=recorded_at.asc`,
        {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return new Map();
      }

      const data: ViewRecord[] = await response.json();
      
      // Get the earliest record for each drama
      const earliestViews = new Map<string, number>();
      
      data.forEach(record => {
        if (!earliestViews.has(record.drama_name)) {
          earliestViews.set(record.drama_name, record.views);
        }
      });

      return earliestViews;
    } catch (err: any) {
      return new Map();
    }
  };

  const fetchPlaylistViews = async (playlistId: string, name: string, keyIndex: number) => {
    try {
      const API_KEY = API_KEYS[keyIndex];
      
      if (!API_KEY) {
        throw new Error('QUOTA_EXCEEDED');
      }

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
        
        // Try to get thumbnail from any available item
        if (!thumbnail && data.items && data.items.length > 0) {
          for (const item of data.items) {
            if (item.snippet?.thumbnails) {
              thumbnail = item.snippet.thumbnails.maxres?.url ||
                         item.snippet.thumbnails.high?.url || 
                         item.snippet.thumbnails.medium?.url ||
                         item.snippet.thumbnails.default?.url ||
                         item.snippet.thumbnails.standard?.url;
              
              if (thumbnail) {
                break;
              }
            }
          }
        }
        
        const videoIds = data.items.map((item: any) => item.contentDetails.videoId);
        allVideoIds = [...allVideoIds, ...videoIds];
        
        nextPageToken = data.nextPageToken || '';
      } while (nextPageToken);

      let totalViews = 0;
      
      // If we still don't have a thumbnail, try to get it from the first video
      if (!thumbnail && allVideoIds.length > 0) {
        try {
          const firstVideoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${allVideoIds[0]}&key=${API_KEY}`;
          const videoResponse = await fetch(firstVideoUrl);
          
          if (videoResponse.ok) {
            const videoData = await videoResponse.json();
            if (videoData.items && videoData.items.length > 0) {
              const videoThumbnails = videoData.items[0].snippet?.thumbnails;
              thumbnail = videoThumbnails?.maxres?.url ||
                         videoThumbnails?.high?.url ||
                         videoThumbnails?.medium?.url ||
                         videoThumbnails?.default?.url ||
                         videoThumbnails?.standard?.url;
            }
          }
        } catch (thumbErr) {
          // Silently fail - will use placeholder
        }
      }
      
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
      throw err;
    }
  };

  const fetchAllDramas = async (playlists?: any[]) => {
    try {
      setLoading(true);
      
      // Use provided playlists or state
      let playlistsToUse = playlists || playlistsFromDB;
      
      // If no playlists in state and none provided, fetch from Supabase
      if (playlistsToUse.length === 0) {
        playlistsToUse = await fetchPlaylistsFromSupabase();
      }
      
      if (playlistsToUse.length === 0) {
        throw new Error('No playlists found in Supabase database');
      }
      
      // Flatten playlists - each drama can have multiple playlist IDs
      const allPlaylistRequests: Array<{dramaName: string; playlistId: string}> = [];
      
      playlistsToUse.forEach((drama: any) => {
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
      
      if (allPlaylistRequests.length === 0) {
        throw new Error('No valid playlist IDs found in database');
      }
      
      const promises = allPlaylistRequests.map(item => 
        fetchPlaylistViews(item.playlistId, item.dramaName, currentKeyIndex)
      );
      
      const results = await Promise.allSettled(promises);
      
      // Check if all failed due to quota
      const allQuotaExceeded = results.every(result => 
        result.status === 'rejected' && result.reason?.message === 'QUOTA_EXCEEDED'
      );
      
      if (allQuotaExceeded) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      const validDramas = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);
      
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
      
      // Convert to array
      const dramaArray = Object.values(combinedDramas);
      
      // Save current view counts to history
      await saveViewCounts(dramaArray as Drama[]);
      
      // Fetch historical data and calculate growth for selected period
      const historicalViews = await fetchHistoricalData(selectedPeriod);
      
      // Add growth data to dramas
      dramaArray.forEach((drama: any) => {
        const previousViews = historicalViews.get(drama.name);
        if (previousViews !== undefined && selectedPeriod !== 'alltime') {
          drama.viewGrowth = drama.views - previousViews;
          drama.previousViews = previousViews;
        } else {
          drama.viewGrowth = drama.views;
          drama.previousViews = 0;
        }
      });
      
      // Sort by growth for period, or by total views for all-time
      const sorted = selectedPeriod === 'alltime'
        ? dramaArray.sort((a: any, b: any) => b.views - a.views)
        : dramaArray.sort((a: any, b: any) => b.viewGrowth - a.viewGrowth);
      
      // Assign unique IDs to avoid React key warnings
      sorted.forEach((drama: any, index: number) => {
        drama.id = `${drama.name.replace(/\s+/g, '-')}-${index}`;
      });
      
      setDramas(sorted as Drama[]);
      setLastUpdate(new Date());
      setError(null);
      setLoading(false);
    } catch (err: any) {
      
      if (err.message === 'QUOTA_EXCEEDED' && currentKeyIndex < API_KEYS.length - 1) {
        const nextKeyIndex = currentKeyIndex + 1;
        setCurrentKeyIndex(nextKeyIndex);
        setError(`Quota exceeded. Switching to API key ${nextKeyIndex + 1}...`);
        
        // Retry with next key after a short delay
        setTimeout(() => {
          fetchAllDramas(playlists || playlistsFromDB);
        }, 2000);
      } else if (err.message === 'QUOTA_EXCEEDED') {
        setError('All API keys have exceeded quota. Please try again tomorrow.');
        setLoading(false);
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  // Initial fetch - only run once
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      
      const initialize = async () => {
        try {
          const playlists = await fetchPlaylistsFromSupabase();
          await fetchAllDramas(playlists);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      };
      
      initialize();
    }
  }, []); // Empty dependency array - only run once

  // Re-sort dramas when period changes (without re-fetching from YouTube)
  useEffect(() => {
    const resortDramas = async () => {
      if (!initialFetchDone.current || dramas.length === 0) {
        return;
      }

      // Fetch historical data for the new period
      const historicalViews = await fetchHistoricalData(selectedPeriod);
      
      // Update growth data for each drama
      const updatedDramas = dramas.map((drama: Drama) => {
        const previousViews = historicalViews.get(drama.name);
        if (previousViews !== undefined && selectedPeriod !== 'alltime') {
          return {
            ...drama,
            viewGrowth: drama.views - previousViews,
            previousViews: previousViews
          };
        } else {
          return {
            ...drama,
            viewGrowth: drama.views,
            previousViews: 0
          };
        }
      });
      
      // Sort by growth for period, or by total views for all-time
      const sorted = selectedPeriod === 'alltime'
        ? updatedDramas.sort((a: Drama, b: Drama) => b.views - a.views)
        : updatedDramas.sort((a: Drama, b: Drama) => b.viewGrowth - a.viewGrowth);
      
      // Re-assign ranks (IDs)
      sorted.forEach((drama: Drama, index: number) => {
        drama.id = `${drama.name.replace(/\s+/g, '-')}-${index}`;
      });
      
      setDramas([...sorted]);
    };

    resortDramas();
  }, [selectedPeriod]);

  // Auto-refresh every 24 hours
  useEffect(() => {
    // Only start interval after initial fetch is complete
    if (!initialFetchDone.current || loading) {
      return;
    }

    const interval = setInterval(() => {
      fetchAllDramas();
    }, 86400000); // 24 hours (24 * 60 * 60 * 1000)

    return () => clearInterval(interval);
  }, [loading]); // Only depend on loading state

  const formatViews = (views: number): string => {
    if (views >= 1000000000) return `${(views / 1000000000).toFixed(2)}B`;
    if (views >= 1000000) return `${(views / 1000000).toFixed(2)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toLocaleString();
  };

  const handleRetry = () => {
    setError(null);
    setCurrentKeyIndex(0); // Reset to first API key
    fetchAllDramas();
  };

  const getPeriodLabel = (period: TimePeriod): string => {
    switch (period) {
      case '24h':
        return 'Last 24 Hours';
      case 'week':
        return 'Last Week';
      case 'month':
        return 'Last Month';
      case 'alltime':
        return 'All Time';
    }
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
            onClick={handleRetry}
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
          <p className="text-gray-600 text-lg mb-4">
            Most viewed drama playlists on YouTube
          </p>

          {/* Time Period Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <button
              onClick={() => setSelectedPeriod('24h')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedPeriod === '24h'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedPeriod === 'week'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedPeriod === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedPeriod('alltime')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedPeriod === 'alltime'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Time
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live • Updates every 24 hours
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Database className="w-3 h-3" />
              API Key {currentKeyIndex + 1}/{API_KEYS.length}
            </div>
            {lastUpdate && (
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="w-3 h-3" />
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
          {error && (
            <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-red-600 text-white px-6 py-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {getPeriodLabel(selectedPeriod)} Rankings
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thumbnail</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Drama Name</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {selectedPeriod === 'alltime' ? 'Total Views' : 'Views Gained'}
                  </th>
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
                          onClick={handleRetry}
                          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dramas.map((drama: Drama, index: number) => (
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
                            {selectedPeriod === 'alltime' 
                              ? formatViews(drama.views)
                              : formatViews(drama.viewGrowth)
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedPeriod === 'alltime' 
                              ? drama.views.toLocaleString()
                              : `+${drama.viewGrowth.toLocaleString()}`
                            }
                          </p>
                          {selectedPeriod !== 'alltime' && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Total: {formatViews(drama.views)}
                            </p>
                          )}
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
            Data refreshes automatically every 24 hourz
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Powered by Supabase • {playlistsFromDB.length} dramas tracked • Ranked by {selectedPeriod === 'alltime' ? 'total views' : 'view growth'} • {API_KEYS.length} API keys
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopDramasTracker;