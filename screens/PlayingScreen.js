import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import theme from '../theme';

const PlayingScreen = () => {
  // State for tracking if the song is playing
  const [isPlaying, setIsPlaying] = useState(false);

  // Current song data
  const currentSong = {
    title: 'Midnight Serenade',
    artist: 'The Ethereal Symphony',
    duration: '4:32',
    currentTime: '2:15',
    progress: 0.52, // 52% of the song has played
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>YouTube Music</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.albumContainer}>
        <View style={styles.albumArt}>
          <View style={styles.colorfulCircle}>
            <View style={styles.innerCircle} />
          </View>
        </View>
      </View>

      {/* Song Info */}
      <View style={styles.songInfoContainer}>
        <Text style={styles.songTitle}>{currentSong.title}</Text>
        <Text style={styles.artistName}>{currentSong.artist}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{currentSong.currentTime}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${currentSong.progress * 100}%` }]} />
        </View>
        <Text style={styles.timeText}>{currentSong.duration}</Text>
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
    // Add a gradient-like background
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#6A11CB',
  },
  colorfulCircle: {
    width: albumSize * 0.8,
    height: albumSize * 0.8,
    borderRadius: albumSize * 0.4,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    // Create a colorful gradient-like effect with border
    borderWidth: albumSize * 0.1,
    borderColor: 'transparent',
    borderTopColor: '#3D5AFE',
    borderRightColor: '#00C853',
    borderBottomColor: '#FFD600',
    borderLeftColor: '#D500F9',
    // Add a shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  innerCircle: {
    width: albumSize * 0.2,
    height: albumSize * 0.2,
    borderRadius: albumSize * 0.1,
    backgroundColor: '#FF9500',
  },
  songInfoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  artistName: {
    fontSize: 16,
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
