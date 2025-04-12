import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useYouTube } from '../context/YouTubeContext';

const TrendingNow = ({ albums, onAlbumPress }) => {
  const { getVideoDetails } = useYouTube();
  const [loadingStates, setLoadingStates] = useState({});
  const { width } = Dimensions.get('window');

  // Calculate item width based on screen width (2.5 items visible at once)
  const itemWidth = (width - theme.spacing.md * 4) / 2.5;

  // Default albums if none provided
  const defaultAlbums = [
    {
      id: '1',
      title: 'Neon Nights',
      artist: 'Crystal Vision',
      cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909',
    },
    {
      id: '2',
      title: 'Desert Wind',
      artist: 'Sahara Soul',
      cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    },
    {
      id: '3',
      title: 'Urban Beats',
      artist: 'City Groove',
      cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    },
    {
      id: '4',
      title: 'Chill Vibes',
      artist: 'Lounge Masters',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
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
        console.log('Playing trending album:', album.title);
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
        <Text style={styles.sectionTitle}>Trending Now</Text>
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
            style={[styles.trendingContainer, { width: itemWidth }]}
            onPress={() => handleAlbumPress(album)}
            activeOpacity={0.7}
          >
            <View style={styles.albumImageContainer}>
              <Image
                source={{ uri: album.cover }}
                style={styles.trendingAlbum}
                resizeMode="cover"
              />
              <View style={styles.playIconContainer}>
                <Ionicons
                  name={loadingStates[album.id] ? "hourglass-outline" : "play-circle"}
                  size={36}
                  color="white"
                />
              </View>
              {loadingStates[album.id] && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
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
  trendingContainer: {
    marginRight: theme.spacing.md,
    // Width is set dynamically based on screen size
  },
  albumImageContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    aspectRatio: 1, // Square aspect ratio
    marginBottom: theme.spacing.sm,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 3,
  },
  trendingAlbum: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.medium,
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: 0.8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  albumTitle: {
    marginTop: theme.spacing.xs,
    fontWeight: '600',
    fontSize: 14,
  },
  albumArtist: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default TrendingNow;
