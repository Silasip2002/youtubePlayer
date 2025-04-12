import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import theme from '../theme';
import { useYouTube } from '../context/YouTubeContext';
import WebView from 'react-native-webview';

const PlayingScreen = () => {
  // State for tracking if the song is playing
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const {
    currentVideo,
    getVideoDetails,
    isLoading,
    error,
    popularMusicVideos
  } = useYouTube();

  // Use the first popular music video if no current video is selected
  useEffect(() => {
    const loadInitialVideo = async () => {
      try {
        if (!currentVideo && popularMusicVideos.length > 0) {
          console.log('Loading initial video:', popularMusicVideos[0].id);
          await getVideoDetails(popularMusicVideos[0].id);
        }
      } catch (err) {
        console.error('Error loading initial video:', err);
      }
    };

    loadInitialVideo();
  }, [currentVideo, popularMusicVideos]);

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowPlayer(true);
  };

  // Format duration
  const formatDuration = (duration) => {
    if (!duration) return '0:00';

    try {
      // YouTube API returns duration in ISO 8601 format (e.g., PT4M13S)
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

      if (!match) return '0:00';

      const hours = (match[1] && match[1].replace('H', '')) || 0;
      const minutes = (match[2] && match[2].replace('M', '')) || 0;
      const seconds = (match[3] && match[3].replace('S', '')) || 0;

      // Convert to strings and pad with zeros
      const paddedSeconds = String(seconds).padStart(2, '0');
      const paddedMinutes = String(minutes).padStart(2, '0');

      if (hours > 0) {
        return `${hours}:${paddedMinutes}:${paddedSeconds}`;
      }

      return `${minutes}:${paddedSeconds}`;
    } catch (error) {
      console.error('Error formatting duration:', error);
      return '0:00';
    }
  };

  // Format view count
  const formatViewCount = (count) => {
    try {
      if (!count) return '0 views';

      // Convert to number if it's a string
      const numCount = typeof count === 'string' ? parseInt(count, 10) : count;

      if (isNaN(numCount)) return '0 views';

      if (numCount >= 1000000) {
        return `${(numCount / 1000000).toFixed(1)}M views`;
      }

      if (numCount >= 1000) {
        return `${(numCount / 1000).toFixed(1)}K views`;
      }

      return `${numCount} views`;
    } catch (error) {
      console.error('Error formatting view count:', error);
      return '0 views';
    }
  };

  if (isLoading && !currentVideo) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading music...</Text>
      </View>
    );
  }

  if (error && !currentVideo) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading music</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  // If no video is loaded yet, show a placeholder
  if (!currentVideo) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>No music selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>YouTube Music</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Album Art / Video Player */}
      <View style={styles.albumContainer}>
        {showPlayer && currentVideo ? (
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: `https://www.youtube.com/embed/${currentVideo.id}?autoplay=1` }}
              style={styles.webView}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              onError={(e) => console.error('WebView error:', e.nativeEvent)}
            />
          </View>
        ) : currentVideo ? (
          <TouchableOpacity style={styles.albumArt} onPress={() => setShowPlayer(true)}>
            <Image
              source={{ uri: currentVideo.thumbnail }}
              style={styles.albumImage}
              resizeMode="cover"
            />
            <View style={styles.playOverlay}>
              <Ionicons name="play-circle" size={60} color="white" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.albumArt}>
            <View style={styles.playOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          </View>
        )}
      </View>

      {/* Song Info */}
      <View style={styles.songInfoContainer}>
        {currentVideo ? (
          <>
            <Text style={styles.songTitle}>{currentVideo.title}</Text>
            <Text style={styles.artistName}>{currentVideo.channelTitle}</Text>
            <Text style={styles.viewCount}>{formatViewCount(currentVideo.viewCount)}</Text>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading video information...</Text>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>0:00</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '0%' }]} />
        </View>
        <Text style={styles.timeText}>
          {currentVideo ? formatDuration(currentVideo.duration) : '0:00'}
        </Text>
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="shuffle" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={32}
            color="#fff"
            style={isPlaying ? null : styles.playPauseIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="repeat" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Additional Controls */}
      <View style={styles.additionalControlsContainer}>
        <TouchableOpacity style={styles.additionalButton}>
          <Ionicons name="heart-outline" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.additionalButton}>
          <MaterialIcons name="playlist-play" size={28} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.additionalButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const albumSize = width * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: theme.spacing.xs,
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  albumArt: {
    width: albumSize,
    height: albumSize,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // Add a subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  albumImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.medium,
  },
  playOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: albumSize,
    height: albumSize,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
  songInfoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  viewCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    width: 35,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginHorizontal: theme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  controlButton: {
    padding: theme.spacing.sm,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseIcon: {
    marginLeft: 4, // Adjust for play icon centering
  },
  additionalControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl,
  },
  additionalButton: {
    padding: theme.spacing.sm,
  },
});

export default PlayingScreen;
