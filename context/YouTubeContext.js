import React, { createContext, useState, useContext, useEffect } from 'react';
import * as YouTubeAPI from '../services/youtubeApi';

// Create context
const YouTubeContext = createContext();

// Custom hook to use the YouTube context
export const useYouTube = () => useContext(YouTubeContext);

// Provider component
export const YouTubeProvider = ({ children }) => {
  // State for trending videos
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [popularMusicVideos, setPopularMusicVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Fetch trending videos on component mount
  useEffect(() => {
    fetchTrendingVideos();
    fetchPopularMusicVideos();
  }, []);

  // Fetch trending videos
  const fetchTrendingVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const videos = await YouTubeAPI.getTrendingVideos();
      setTrendingVideos(videos);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trending videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch popular music videos
  const fetchPopularMusicVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const videos = await YouTubeAPI.getPopularMusicVideos();
      setPopularMusicVideos(videos);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching popular music videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search videos
  const searchVideos = async (query) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await YouTubeAPI.searchVideos(query);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError(err.message);
      console.error('Error searching videos:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get video details and related videos
  const getVideoDetails = async (videoId) => {
    try {
      if (!videoId) {
        console.error('No video ID provided to getVideoDetails');
        setError('No video ID provided');
        return { details: null, related: [] };
      }

      setIsLoading(true);
      setError(null);

      console.log('Fetching details for video ID:', videoId);

      // Fetch video details and related videos in parallel
      const [details, related] = await Promise.all([
        YouTubeAPI.getVideoDetails(videoId),
        YouTubeAPI.getRelatedVideos(videoId)
      ]);

      console.log('Video details fetched successfully:', details.title);

      setCurrentVideo(details);
      setRelatedVideos(related);

      return { details, related };
    } catch (err) {
      console.error('Error fetching video details:', err);
      setError(err.message || 'Error loading video');
      return { details: null, related: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear current video
  const clearCurrentVideo = () => {
    setCurrentVideo(null);
    setRelatedVideos([]);
  };

  // Context value
  const value = {
    trendingVideos,
    popularMusicVideos,
    isLoading,
    error,
    currentVideo,
    relatedVideos,
    searchResults,
    fetchTrendingVideos,
    fetchPopularMusicVideos,
    searchVideos,
    getVideoDetails,
    clearCurrentVideo,
  };

  return (
    <YouTubeContext.Provider value={value}>
      {children}
    </YouTubeContext.Provider>
  );
};

export default YouTubeContext;
