import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, StatusBar, View } from 'react-native';
import theme from './theme';
import { YouTubeProvider } from './context/YouTubeContext';

// Import components
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import HomeContent from './components/HomeContent';

// Import screens
import ExploreScreen from './screens/ExploreScreenWithAPI';
import PlayingScreen from './screens/PlayingScreenWithAPI';
import LibraryScreen from './screens/LibraryScreenWithAPI';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('Alex');

  // We'll use the YouTube API data instead of sample data

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  // Render home screen content
  const renderHomeScreen = () => {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.scrollView}>
          <Header username={username} />
          <HomeContent />
        </ScrollView>
      </>
    );
  };

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

// Wrap the App component with the YouTubeProvider
export default function AppWrapper() {
  return (
    <YouTubeProvider>
      <App />
    </YouTubeProvider>
  );
}
