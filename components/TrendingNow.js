import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import theme from '../theme';

const TrendingNow = ({ albums }) => {
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
  ];

  const albumsToRender = albums || defaultAlbums;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {albumsToRender.map((album) => (
          <TouchableOpacity key={album.id} style={styles.trendingContainer}>
            <Image source={{ uri: album.cover }} style={styles.trendingAlbum} />
            <Text style={styles.albumTitle}>{album.title}</Text>
            <Text style={styles.albumArtist}>{album.artist}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.subheading,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  trendingContainer: {
    marginRight: theme.spacing.md,
    width: 150,
  },
  trendingAlbum: {
    width: 150,
    height: 150,
    borderRadius: theme.borderRadius.medium,
  },
  albumTitle: {
    marginTop: theme.spacing.sm,
    fontWeight: '600',
  },
  albumArtist: {
    ...theme.typography.caption,
  },
});

export default TrendingNow;
