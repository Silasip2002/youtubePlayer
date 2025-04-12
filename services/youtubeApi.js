import { YOUTUBE_API_KEY, YOUTUBE_API_BASE_URL, MAX_RESULTS } from './config';

/**
 * Search for videos on YouTube
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise} - Promise that resolves to search results
 */
export const searchVideos = async (query, maxResults = MAX_RESULTS) => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(
        query
      )}&maxResults=${maxResults}&type=video&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error);
      throw new Error(data.error.message);
    }

    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};

/**
 * Get trending videos on YouTube
 * @param {string} regionCode - ISO 3166-1 alpha-2 country code
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise} - Promise that resolves to trending videos
 */
export const getTrendingVideos = async (regionCode = 'US', maxResults = MAX_RESULTS) => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error);
      throw new Error(data.error.message);
    }

    return data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
    }));
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    throw error;
  }
};

/**
 * Get video details by ID
 * @param {string} videoId - YouTube video ID
 * @returns {Promise} - Promise that resolves to video details
 */
export const getVideoDetails = async (videoId) => {
  if (!videoId) {
    throw new Error('Video ID is required');
  }

  try {
    console.log(`Fetching video details for ID: ${videoId}`);
    const url = `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    console.log('Request URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('YouTube API Error:', data.error);
      throw new Error(data.error.message || 'YouTube API Error');
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const item = data.items[0];

    // Safely access nested properties
    const thumbnails = item.snippet?.thumbnails || {};
    const highThumbnail = thumbnails.high || thumbnails.medium || thumbnails.default || {};

    return {
      id: item.id,
      title: item.snippet?.title || 'Unknown Title',
      description: item.snippet?.description || '',
      thumbnail: highThumbnail.url || 'https://via.placeholder.com/480x360.png?text=No+Thumbnail',
      channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
      publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
      duration: item.contentDetails?.duration || 'PT0S',
      viewCount: item.statistics?.viewCount || '0',
      likeCount: item.statistics?.likeCount || '0',
      commentCount: item.statistics?.commentCount || '0',
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

/**
 * Get related videos for a specific video
 * @param {string} videoId - YouTube video ID
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise} - Promise that resolves to related videos
 */
export const getRelatedVideos = async (videoId, maxResults = MAX_RESULTS) => {
  if (!videoId) {
    throw new Error('Video ID is required for related videos');
  }

  try {
    console.log(`Fetching related videos for ID: ${videoId}`);
    const url = `${YOUTUBE_API_BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error);
      throw new Error(data.error.message || 'YouTube API Error');
    }

    if (!data.items || !Array.isArray(data.items)) {
      console.warn('No related videos found or invalid response format');
      return [];
    }

    return data.items.map(item => {
      // Safely access nested properties
      const thumbnails = item.snippet?.thumbnails || {};
      const highThumbnail = thumbnails.high || thumbnails.medium || thumbnails.default || {};

      return {
        id: item.id?.videoId || '',
        title: item.snippet?.title || 'Unknown Title',
        description: item.snippet?.description || '',
        thumbnail: highThumbnail.url || 'https://via.placeholder.com/480x360.png?text=No+Thumbnail',
        channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
        publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
      };
    }).filter(item => item.id); // Filter out items with no ID
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
};

/**
 * Get videos from a specific channel
 * @param {string} channelId - YouTube channel ID
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise} - Promise that resolves to channel videos
 */
export const getChannelVideos = async (channelId, maxResults = MAX_RESULTS) => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&maxResults=${maxResults}&type=video&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error);
      throw new Error(data.error.message);
    }

    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    throw error;
  }
};

/**
 * Get popular music videos
 * @param {string} regionCode - ISO 3166-1 alpha-2 country code
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise} - Promise that resolves to popular music videos
 */
export const getPopularMusicVideos = async (regionCode = 'US', maxResults = MAX_RESULTS) => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&videoCategoryId=10&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error);
      throw new Error(data.error.message);
    }

    return data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
    }));
  } catch (error) {
    console.error('Error fetching popular music videos:', error);
    throw error;
  }
};
