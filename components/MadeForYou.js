import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useYouTube } from '../context/YouTubeContext';

const MadeForYou = ({ playlists, onPlaylistPress }) => {
  const { getVideoDetails, searchVideos } = useYouTube();

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
  ];

  const playlistsToRender = playlists || defaultPlaylists;

  // Handle playlist press
  const handlePlaylistPress = async (playlist) => {
    if (onPlaylistPress) {
      onPlaylistPress(playlist);
    } else {
      try {
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
      } catch (error) {
        console.error('Error playing playlist:', error);
      }
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Made For You</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {playlistsToRender.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            style={styles.playlistCard}
            onPress={() => handlePlaylistPress(playlist)}
          >
            <Image source={{ uri: playlist.cover }} style={styles.playlistImage} />
            <View style={styles.playlistOverlay}>
              <Text style={styles.playlistTitle}>{playlist.title}</Text>
              <Text style={styles.playlistSubtitle}>{playlist.subtitle}</Text>
              <Text style={styles.playlistDescription}>{playlist.description}</Text>
              {playlist.secondaryDescription && (
                <Text style={styles.playlistDescription}>{playlist.secondaryDescription}</Text>
              )}
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
  playlistCard: {
    width: 220,
    height: 120,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
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
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playlistTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  playlistSubtitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  playlistDescription: {
    color: '#fff',
    fontSize: theme.typography.caption.fontSize,
  },
});

export default MadeForYou;
