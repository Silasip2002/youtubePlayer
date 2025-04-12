import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useYouTube } from '../context/YouTubeContext';

const RecentlyPlayed = ({ albums, onAlbumPress }) => {
  const { getVideoDetails } = useYouTube();

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
  ];

  const albumsToRender = albums || defaultAlbums;

  // Handle album press
  const handleAlbumPress = (album) => {
    if (onAlbumPress) {
      onAlbumPress(album);
    } else if (album.id) {
      console.log('Playing album:', album.title);
      getVideoDetails(album.id);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {albumsToRender.map((album) => (
          <TouchableOpacity
            key={album.id}
            style={styles.albumContainer}
            onPress={() => handleAlbumPress(album)}
          >
            <Image source={{ uri: album.cover }} style={styles.circleAlbum} />
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
  seeAll: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  albumContainer: {
    marginRight: theme.spacing.md,
    width: 120,
    alignItems: 'center',
  },
  circleAlbum: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.circle,
  },
  albumTitle: {
    marginTop: theme.spacing.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  albumArtist: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
});

export default RecentlyPlayed;
