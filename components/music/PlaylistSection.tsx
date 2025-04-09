import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface Playlist {
  id: string;
  title: string;
  imageUrl: string;
}

interface Props {
  title: string;
  playlists: Playlist[];
}

export function PlaylistSection({ title, playlists }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {playlists.map(playlist => (
          <TouchableOpacity key={playlist.id} style={styles.playlistItem}>
            <Image source={{ uri: playlist.imageUrl }} style={styles.playlistImage} />
            <ThemedText>{playlist.title}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  playlistItem: {
    marginRight: 15,
    width: 150,
  },
  playlistImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
});
