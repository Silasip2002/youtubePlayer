import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const ExploreScreen = () => {
  // Categories data
  const categories = [
    { id: '1', name: 'For You', highlighted: true },
    { id: '2', name: 'Charts' },
    { id: '3', name: 'New' },
    { id: '4', name: 'Genres' },
    { id: '5', name: 'Moods' },
  ];

  // Featured playlists data
  const featuredPlaylists = [
    {
      id: '1',
      title: 'Top Hits 2025',
      description: 'The hottest tracks right now',
      likes: '2.5M',
    },
    {
      id: '2',
      title: 'Chill Vibes',
      description: 'Relaxing beats for your day',
      likes: '1.8M',
    },
    {
      id: '3',
      title: 'Workout Energy',
      description: 'Power your fitness routine',
      likes: '3.2M',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryIconContainer}>
                <Text style={styles.placeholderText}>Image</Text>
              </View>
              <Text
                style={[
                  styles.categoryName,
                  category.highlighted && styles.categoryHighlighted
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Playlists */}
        <View style={styles.featuredContainer}>
          <Text style={styles.sectionTitle}>Featured Playlists</Text>

          {featuredPlaylists.map((playlist) => (
            <TouchableOpacity key={playlist.id} style={styles.playlistItem}>
              <View style={styles.playlistImage}>
                <Text style={styles.placeholderText}>Image</Text>
              </View>
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistTitle}>{playlist.title}</Text>
                <Text style={styles.playlistDescription}>{playlist.description}</Text>
                <View style={styles.likesContainer}>
                  <Ionicons name="heart" size={14} color={theme.colors.primary} />
                  <Text style={styles.likesText}>{playlist.likes}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
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
    ...theme.typography.heading,
  },
  searchButton: {
    padding: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  categoryIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  placeholderText: {
    fontSize: 12,
    color: '#888',
  },
  categoryName: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  categoryHighlighted: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  featuredContainer: {
    paddingHorizontal: theme.spacing.md,
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
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.small,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  playlistTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  playlistDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  likesText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  playButton: {
    padding: theme.spacing.xs,
  },
});

export default ExploreScreen;
