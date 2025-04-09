import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home', activeIcon: 'home' },
    { id: 'explore', label: 'Explore', icon: 'compass-outline', activeIcon: 'compass' },
    { id: 'library', label: 'Library', icon: 'library-outline', activeIcon: 'library' },
    { id: 'playing', label: 'Playing', icon: 'musical-notes-outline', activeIcon: 'musical-notes' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.navItem}
            onPress={() => onTabPress && onTabPress(tab.id)}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  activeNavText: {
    color: theme.colors.primary,
  },
});

export default BottomNavigation;
