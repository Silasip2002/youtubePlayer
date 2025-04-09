import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, StatusBar, View } from 'react-native';
import theme from './theme';

// Import components
import Header from './components/Header';
import RecentlyPlayed from './components/RecentlyPlayed';
import MadeForYou from './components/MadeForYou';
import TrendingNow from './components/TrendingNow';
import BottomNavigation from './components/BottomNavigation';

// Import screens
import ExploreScreen from './screens/ExploreScreen';
import PlayingScreen from './screens/PlayingScreen';
import LibraryScreen from './screens/LibraryScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('Alex');

  // Sample data for recently played
  const recentlyPlayedAlbums = [
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

  // Sample data for made for you playlists
  const madeForYouPlaylists = [
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

  // Sample data for trending now
  const trendingAlbums = [
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

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  // Render home screen content
  const renderHomeScreen = () => (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <Header username={username} />
        <RecentlyPlayed albums={recentlyPlayedAlbums} />
        <MadeForYou playlists={madeForYouPlaylists} />
        <TrendingNow albums={trendingAlbums} />
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {activeTab === 'home' && renderHomeScreen()}
      {activeTab === 'explore' && <ExploreScreen />}
      {activeTab === 'library' && <LibraryScreen />}
      {activeTab === 'playing' && <PlayingScreen />}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  centeredView: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  placeholderText: {
    width: 150,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});

