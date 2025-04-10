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
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error('YouTube API Error:', data.error);
      throw new Error(data.error.message);
    }
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const item = data.items[0];
    
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      commentCount: item.statistics.commentCount,
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
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
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
    console.error('Error fetching related videos:', error);
    throw error;
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
