import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useYouTube } from '../context/YouTubeContext';
import RecentlyPlayed from './RecentlyPlayed';
import MadeForYou from './MadeForYou';
import TrendingNow from './TrendingNow';
import theme from '../theme';

const HomeContent = () => {
  const {
    trendingVideos,
    popularMusicVideos,
    isLoading,
    error,
    fetchTrendingVideos,
    fetchPopularMusicVideos,
    getVideoDetails
  } = useYouTube();

  useEffect(() => {
    // Fetch data if not already loaded
    if (trendingVideos.length === 0) {
      fetchTrendingVideos();
    }
    if (popularMusicVideos.length === 0) {
      fetchPopularMusicVideos();
    }
  }, []);

  // Format trending videos for the TrendingNow component
  const formattedTrendingVideos = trendingVideos.map(video => ({
    id: video.id,
    title: video.title,
    artist: video.channelTitle,
    cover: video.thumbnail,
  }));

  // Format popular music videos for the RecentlyPlayed component
  const formattedPopularMusicVideos = popularMusicVideos.map(video => ({
    id: video.id,
    title: video.title,
    artist: video.channelTitle,
    cover: video.thumbnail,
  }));

  // Create playlists for MadeForYou component
  const madeForYouPlaylists = [
    {
      id: '1',
      title: 'TRENDING',
      subtitle: 'Top Music',
      description: 'Popular on YouTube Music',
      cover: popularMusicVideos[0]?.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    },
    {
      id: '2',
      title: 'DISCOVERY',
      subtitle: 'New Releases',
      description: 'Fresh music for you',
      secondaryDescription: 'Based on trending videos',
      cover: popularMusicVideos[1]?.thumbnail || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    },
  ];

  if (isLoading && trendingVideos.length === 0 && popularMusicVideos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading music...</Text>
      </View>
    );
  }

  if (error && trendingVideos.length === 0 && popularMusicVideos.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading content</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  // Handle item press to play video
  const handleItemPress = (item) => {
    if (item && item.id) {
      console.log('Playing item from HomeContent:', item.title);
      getVideoDetails(item.id);
    }
  };

  return (
    <View>
      <RecentlyPlayed
        albums={formattedPopularMusicVideos}
        onAlbumPress={handleItemPress}
      />
      <MadeForYou
        playlists={madeForYouPlaylists}
        onPlaylistPress={handleItemPress}
      />
      <TrendingNow
        albums={formattedTrendingVideos}
        onAlbumPress={handleItemPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  errorMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeContent;
