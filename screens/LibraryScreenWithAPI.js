import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import theme from '../theme';
import { useYouTube } from '../context/YouTubeContext';

const LibraryScreen = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('playlists');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    trendingVideos, 
    popularMusicVideos, 
    isLoading, 
    error, 
    getVideoDetails 
  } = useYouTube();

  // Create playlists from YouTube data
  const getPlaylists = () => {
    // If we have trending videos, create playlists from them
    if (trendingVideos.length > 0) {
      // Group videos by channel
      const groupedByChannel = trendingVideos.reduce((acc, video) => {
        if (!acc[video.channelTitle]) {
          acc[video.channelTitle] = [];
        }
        acc[video.channelTitle].push(video);
        return acc;
      }, {});

      // Create playlists from grouped videos
      return Object.entries(groupedByChannel).map(([channelTitle, videos], index) => ({
        id: `trending-${index}`,
        title: `${channelTitle} Mix`,
        songs: videos.length,
        image: videos[0].thumbnail,
        isLiked: index % 2 === 0, // Alternate for demo
        isDownloaded: index % 3 === 0, // Alternate for demo
        videos: videos,
      }));
    }

    // Fallback to sample data if no trending videos
    return [
      {
        id: '1',
        title: 'Summer Vibes 2023',
        songs: 45,
        image: null,
        isLiked: true,
        isDownloaded: false,
      },
      {
        id: '2',
        title: 'Workout Motivation',
        songs: 32,
        image: null,
        isLiked: false,
        isDownloaded: true,
      },
    ];
  };

  // Handle playlist item press
  const handlePlaylistPress = (playlist) => {
    if (playlist.videos && playlist.videos.length > 0) {
      // Play the first video in the playlist
      getVideoDetails(playlist.videos[0].id);
    }
  };

  // Render playlist item
  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity style={styles.playlistItem} onPress={() => handlePlaylistPress(item)}>
      <View style={styles.playlistImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.playlistImage} />
        ) : (
          <View style={styles.playlistImage}>
            <Text style={styles.imageText}>Image</Text>
          </View>
        )}
        {item.isLiked && (
          <View style={styles.iconOverlay}>
            <Ionicons name="heart" size={18} color="#FF5252" style={styles.heartIcon} />
          </View>
        )}
        {item.isDownloaded && (
          <View style={[styles.iconOverlay, { right: 15 }]}>
            <Ionicons name="arrow-down-circle" size={18} color="#3D5AFE" style={styles.downloadIcon} />
          </View>
        )}
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle}>{item.title}</Text>
        <Text style={styles.playlistSongs}>{item.songs} songs</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="funnel-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your library"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsWrapper}>
            {['Playlists', 'Albums', 'Artists', 'Songs'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab.toLowerCase() && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab.toLowerCase())}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.toLowerCase() && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Loading indicator */}
      {isLoading && trendingVideos.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your library...</Text>
        </View>
      )}

      {/* Error message */}
      {error && trendingVideos.length === 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      {/* Playlist List */}
      {(!isLoading || trendingVideos.length > 0) && (
        <FlatList
          data={getPlaylists().filter(playlist => 
            searchQuery === '' || 
            playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.playlistsContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {activeTab} found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 40,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sortButton: {
    padding: theme.spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
  },
  tab: {
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.lg,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
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
    color: 'red',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: theme.spacing.xl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  playlistsContainer: {
    padding: theme.spacing.md,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  playlistImageContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  playlistImage: {
    width: 60,
    height: 60,
    backgroundColor: '#E0E0E0',
    borderRadius: theme.borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  heartIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
    overflow: 'hidden',
  },
  downloadIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
    overflow: 'hidden',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  playlistSongs: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  moreButton: {
    padding: theme.spacing.sm,
  },
});

export default LibraryScreen;
