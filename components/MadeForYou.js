import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useYouTube } from '../context/YouTubeContext';

const MadeForYou = ({ playlists, onPlaylistPress }) => {
  const { getVideoDetails, searchVideos } = useYouTube();
  const [loadingStates, setLoadingStates] = useState({});
  const { width } = Dimensions.get('window');

  // Calculate item width based on screen width (1.5 items visible at once)
  const itemWidth = (width - theme.spacing.md * 3) / 1.5;

  // Default playlists if none provided
  const defaultPlaylists = [
    {
      id: '1',
      title: 'MUSIC',
      subtitle: 'Your Daily Mix',
      description: 'Based on your recent listening',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    },
    {
      id: '2',
      title: 'DISCOVERY',
      subtitle: 'PLAYLIST',
      description: 'Discover Weekly',
      secondaryDescription: 'New music for you',
      cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    },
    {
      id: '3',
      title: 'CHILL',
      subtitle: 'VIBES',
      description: 'Relaxing music',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    },
  ];

  const playlistsToRender = playlists || defaultPlaylists;

  // Handle playlist press
  const handlePlaylistPress = async (playlist) => {
    try {
      // Set loading state for this playlist
      setLoadingStates(prev => ({ ...prev, [playlist.id]: true }));

      if (onPlaylistPress) {
        onPlaylistPress(playlist);
      } else {
        console.log('Playing playlist:', playlist.title);
        // Search for videos related to the playlist title and description
        const searchTerm = `${playlist.title} ${playlist.description || ''} music`;
        const results = await searchVideos(searchTerm);

        if (results && results.length > 0) {
          // Play the first video from search results
          getVideoDetails(results[0].id);
        } else if (playlist.id) {
          // Fallback to using the playlist ID if it's a valid video ID
          getVideoDetails(playlist.id);
        }
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    } finally {
      // Clear loading state after a short delay to show feedback
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [playlist.id]: false }));
      }, 1000);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Made For You</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={itemWidth + theme.spacing.md}
        snapToAlignment="start"
      >
        {playlistsToRender.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            style={[styles.playlistCard, { width: itemWidth }]}
            onPress={() => handlePlaylistPress(playlist)}
            activeOpacity={0.8}
          >
            <View style={styles.playlistImageContainer}>
              <Image
                source={{ uri: playlist.cover }}
                style={styles.playlistImage}
                resizeMode="cover"
              />
              <View style={styles.playlistOverlay}>
                <Text style={styles.playlistTitle}>{playlist.title}</Text>
                <Text style={styles.playlistSubtitle}>{playlist.subtitle}</Text>
                <Text style={styles.playlistDescription} numberOfLines={1}>{playlist.description}</Text>
                {playlist.secondaryDescription && (
                  <Text style={styles.playlistDescription} numberOfLines={1}>{playlist.secondaryDescription}</Text>
                )}
                {loadingStates[playlist.id] ? (
                  <ActivityIndicator size="small" color="white" style={styles.playlistLoader} />
                ) : (
                  <Ionicons name="play-circle" size={24} color="white" style={styles.playlistIcon} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllButton: {
    padding: theme.spacing.xs,
  },
  seeAll: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingRight: theme.spacing.md * 2,
    paddingBottom: theme.spacing.sm,
  },
  playlistCard: {
    height: 160,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 4,
  },
  playlistImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },
  playlistImage: {
    width: '100%',
    height: '100%',
  },
  playlistOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // Add gradient effect
    borderTopLeftRadius: 40,
    borderTopRightRadius: 0,
  },
  playlistTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playlistSubtitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playlistDescription: {
    color: '#fff',
    fontSize: theme.typography.caption.fontSize,
    opacity: 0.9,
  },
  playlistLoader: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  playlistIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default MadeForYou;
