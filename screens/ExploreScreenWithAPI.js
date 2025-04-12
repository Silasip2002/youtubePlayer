import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useYouTube } from '../context/YouTubeContext';

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('For You');
  const { searchVideos, searchResults, isLoading, error, trendingVideos, popularMusicVideos, getVideoDetails } = useYouTube();

  // Categories data
  const categories = [
    { id: '1', name: 'For You', highlighted: activeCategory === 'For You' },
    { id: '2', name: 'Charts', highlighted: activeCategory === 'Charts' },
    { id: '3', name: 'New', highlighted: activeCategory === 'New' },
    { id: '4', name: 'Genres', highlighted: activeCategory === 'Genres' },
    { id: '5', name: 'Moods', highlighted: activeCategory === 'Moods' },
  ];

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchVideos(searchQuery);
    }
  };

  // Handle category press
  const handleCategoryPress = (category) => {
    setActiveCategory(category);
  };

  // Get playlists based on active category
  const getPlaylists = () => {
    // Helper function to ensure unique IDs
    const createUniqueItems = (videos) => {
      const seenIds = new Map();
      return videos.map((video, index) => {
        // Create a unique key by adding a prefix if the ID is a duplicate
        const uniqueId = seenIds.has(video.id)
          ? `${video.id}_${index}`
          : video.id;

        // Mark this ID as seen
        seenIds.set(video.id, true);

        return {
          id: uniqueId, // Use the unique ID as the key
          originalId: video.id, // Keep the original ID for API calls
          title: video.title,
          description: video.channelTitle || `${video.viewCount} views`,
          thumbnail: video.thumbnail,
        };
      });
    };

    if (searchQuery.trim() && searchResults.length > 0) {
      return createUniqueItems(searchResults);
    }

    switch (activeCategory) {
      case 'Charts':
        return createUniqueItems(trendingVideos);
      case 'New':
        return createUniqueItems(popularMusicVideos);
      default:
        // Mix of trending and popular for "For You"
        const combined = [...trendingVideos.slice(0, 3), ...popularMusicVideos.slice(0, 3)];
        return createUniqueItems(combined);
    }
  };

  // Render category item
  const renderCategoryItem = ({ id, name, highlighted }) => (
    <TouchableOpacity
      key={id}
      style={[styles.categoryItem, highlighted && styles.highlightedCategory]}
      onPress={() => handleCategoryPress(name)}
    >
      <Text style={[styles.categoryText, highlighted && styles.highlightedCategoryText]}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  // Handle playlist item press - play the video
  const handlePlaylistItemPress = (item) => {
    if (item) {
      // Use originalId if available, otherwise use id
      const videoId = item.originalId || item.id;
      if (videoId) {
        console.log('Playing video:', videoId);
        getVideoDetails(videoId);
      }
    }
  };

  // Render playlist item
  const renderPlaylistItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.playlistItem}
      onPress={() => handlePlaylistItemPress(item)}
    >
      <View style={styles.playlistImageContainer}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.playlistImage} />
        ) : (
          <View style={styles.playlistImage}>
            <Text style={styles.imageText}>Image</Text>
          </View>
        )}
        <View style={styles.playIcon}>
          <Ionicons name="play-circle" size={24} color="white" />
        </View>
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.playlistDescription} numberOfLines={1}>{item.description}</Text>
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
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search YouTube Music"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategoryItem)}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {/* Error message */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {/* Playlists */}
        {!isLoading && !error && (
          <View style={styles.playlistsContainer}>
            <Text style={styles.sectionTitle}>
              {searchQuery.trim() ? `Results for "${searchQuery}"` : `${activeCategory} Playlists`}
            </Text>
            {getPlaylists().map(renderPlaylistItem)}
          </View>
        )}
      </ScrollView>
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
  searchButton: {
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
  clearButton: {
    padding: theme.spacing.xs,
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.md,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  highlightedCategory: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  highlightedCategoryText: {
    color: 'white',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  playlistsContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.md,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: '#f9f9f9',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.sm,
  },
  playlistImageContainer: {
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  playIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.small,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  moreButton: {
    padding: theme.spacing.sm,
  },
});

export default ExploreScreen;
