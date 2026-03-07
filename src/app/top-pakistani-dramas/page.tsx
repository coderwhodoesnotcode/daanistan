'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Trophy, Clock, TrendingUp } from 'lucide-react';

type TimePeriod = '24h' | 'week' | 'month' | 'alltime';

interface ViewRecord {
  drama_name: string;
  views: number;
  recorded_at: string;
}

interface Drama {
  id: number;
  drama_name: string;
  total_views: number;
  video_count: number;
  playlist_count: number;
  thumbnail: string;
  last_updated: string;
  playlist_id_1?: string;
  playlist_id_2?: string;
  playlist_id_3?: string;
  viewGrowth: number;
  previousViews: number;
}

interface TopDramasTrackerProps {
  initialDramas?: Drama[]; // Made optional
}

const TopDramasTracker: React.FC<TopDramasTrackerProps> = ({ initialDramas = [] }) => {
  const [dramas, setDramas] = useState<Drama[]>(initialDramas);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('alltime');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(
    initialDramas.length > 0 && initialDramas[0]?.last_updated 
      ? new Date(initialDramas[0].last_updated) 
      : null
  );

  // Fetch historical data for growth calculations
  const fetchHistoricalData = async (period: TimePeriod): Promise<Map<string, number>> => {
    try {
      if (period === 'alltime') {
        return new Map();
      }

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

      // Use API route instead of direct Supabase call
      const response = await fetch(
        `/api/view-history?period=${period}&startDate=${periodStart.toISOString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch historical data');
        return new Map();
      }

      const data: ViewRecord[] = await response.json();

      // Get the earliest record for each drama
      const earliestViews = new Map<string, number>();

      data.forEach((record) => {
        if (!earliestViews.has(record.drama_name)) {
          earliestViews.set(record.drama_name, record.views);
        }
      });

      return earliestViews;
    } catch (err: any) {
      console.error('Error fetching historical data:', err);
      return new Map();
    }
  };

  // Re-sort dramas when period changes
  useEffect(() => {
    const resortDramas = async () => {
      if (!initialDramas || initialDramas.length === 0) return;

      // Fetch historical data for the new period
      const historicalViews = await fetchHistoricalData(selectedPeriod);

      // Update growth data for each drama - use initialDramas to avoid stale state
      const updatedDramas = initialDramas.map((drama) => {
        const previousViews = historicalViews.get(drama.drama_name);
        if (previousViews !== undefined && selectedPeriod !== 'alltime') {
          return {
            ...drama,
            viewGrowth: drama.total_views - previousViews,
            previousViews: previousViews,
          };
        } else {
          return {
            ...drama,
            viewGrowth: drama.total_views,
            previousViews: 0,
          };
        }
      });

      // Sort by growth for period, or by total views for all-time
      const sorted =
        selectedPeriod === 'alltime'
          ? updatedDramas.sort((a, b) => b.total_views - a.total_views)
          : updatedDramas.sort((a, b) => b.viewGrowth - a.viewGrowth);

      setDramas([...sorted]);
    };

    resortDramas();
  }, [selectedPeriod, initialDramas]);

  const formatViews = (views: number): string => {
    if (views >= 1000000000) return `${(views / 1000000000).toFixed(2)}B`;
    if (views >= 1000000) return `${(views / 1000000).toFixed(2)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toLocaleString();
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
          <p className="text-gray-600 text-lg mb-4">Most viewed drama playlists on YouTube</p>

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
            {lastUpdate && (
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="w-3 h-3" />
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Thumbnail
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Drama Name
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {selectedPeriod === 'alltime' ? 'Total Views' : 'Views Gained'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dramas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-lg font-medium mb-2">No dramas available yet</p>
                        <p className="text-sm">
                          Run the cron job to populate drama data:
                        </p>
                        <code className="text-xs bg-gray-100 px-3 py-1 rounded mt-2 inline-block">
                          curl -H "Authorization: Bearer my-secret-key-12345" http://localhost:3000/api/update-drama-stats
                        </code>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dramas.map((drama, index) => (
                    <tr
                      key={drama.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === 0
                          ? 'bg-amber-50'
                          : index === 1
                          ? 'bg-gray-50'
                          : index === 2
                          ? 'bg-orange-50'
                          : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                              index === 0
                                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                                : index === 1
                                ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                                : index === 2
                                ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {index + 1}
                          </div>
                          {index < 3 && (
                            <Trophy
                              className={`w-5 h-5 ${
                                index === 0
                                  ? 'text-amber-500'
                                  : index === 1
                                  ? 'text-gray-400'
                                  : 'text-orange-500'
                              }`}
                            />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <img
                          src={drama.thumbnail}
                          alt={drama.drama_name}
                          className="w-32 h-20 object-cover rounded-lg shadow-md"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/480x360?text=No+Thumbnail';
                          }}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">{drama.drama_name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {drama.video_count || 0} episodes
                            {drama.playlist_count > 1 && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                {drama.playlist_count} playlists
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
                                ? formatViews(drama.total_views || 0)
                                : formatViews(drama.viewGrowth || 0)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {selectedPeriod === 'alltime'
                                ? (drama.total_views || 0).toLocaleString()
                                : `+${(drama.viewGrowth || 0).toLocaleString()}`}
                            </p>
                            {selectedPeriod !== 'alltime' && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                Total: {formatViews(drama.total_views || 0)}
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
          <p className="text-sm text-gray-500">Data refreshes automatically every 24 hours</p>
          <p className="text-xs text-gray-400 mt-2">
            Powered by Supabase • {dramas.length} dramas tracked • Ranked by{' '}
            {selectedPeriod === 'alltime' ? 'total views' : 'view growth'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopDramasTracker;