import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useYouTube } from '../context/YouTubeContext';

const RecentlyPlayed = ({ albums, onAlbumPress }) => {
  const { getVideoDetails } = useYouTube();
  const [loadingStates, setLoadingStates] = useState({});
  const { width } = Dimensions.get('window');

  // Calculate item width based on screen width (3.5 items visible at once)
  const itemWidth = (width - theme.spacing.md * 4) / 3.5;

  // Default albums if none provided
  const defaultAlbums = [
    {
      id: '1',
      title: 'Midnight Dreams',
      artist: 'Luna Eclipse',
      cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909',
    },
    {
      id: '2',
      title: 'Summer Breeze',
      artist: 'Coastal Waves',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    },
    {
      id: '3',
      title: 'Electric Soul',
      artist: 'Neon Pulse',
      cover: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031',
    },
    {
      id: '4',
      title: 'Jazz Fusion',
      artist: 'Smooth Quartet',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    },
    {
      id: '5',
      title: 'Morning Calm',
      artist: 'Ambient Sounds',
      cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    },
  ];

  const albumsToRender = albums || defaultAlbums;

  // Handle album press
  const handleAlbumPress = (album) => {
    try {
      // Set loading state for this album
      setLoadingStates(prev => ({ ...prev, [album.id]: true }));

      if (onAlbumPress) {
        onAlbumPress(album);
      } else if (album.id) {
        console.log('Playing album:', album.title);
        getVideoDetails(album.id);
      }
    } catch (error) {
      console.error('Error playing album:', error);
    } finally {
      // Clear loading state after a short delay to show feedback
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [album.id]: false }));
      }, 1000);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
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
        {albumsToRender.map((album) => (
          <TouchableOpacity
            key={album.id}
            style={[styles.albumContainer, { width: itemWidth }]}
            onPress={() => handleAlbumPress(album)}
            activeOpacity={0.7}
          >
            <View style={styles.albumImageContainer}>
              <Image
                source={{ uri: album.cover }}
                style={styles.circleAlbum}
                resizeMode="cover"
              />
              {loadingStates[album.id] ? (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
              ) : (
                <View style={styles.playIconContainer}>
                  <Ionicons name="play-circle" size={36} color="white" />
                </View>
              )}
            </View>
            <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
            <Text style={styles.albumArtist} numberOfLines={1}>{album.artist}</Text>
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
  albumContainer: {
    marginRight: theme.spacing.md,
    alignItems: 'center',
    // Width is set dynamically based on screen size
  },
  albumImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1, // Square aspect ratio
    marginBottom: theme.spacing.sm,
  },
  circleAlbum: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.circle,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 3,
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: theme.borderRadius.circle,
    opacity: 0,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: theme.borderRadius.circle,
  },
  albumTitle: {
    marginTop: theme.spacing.xs,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
  albumArtist: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    width: '100%',
    marginTop: 2,
  },
});

export default RecentlyPlayed;
