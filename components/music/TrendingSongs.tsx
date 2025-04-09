import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface Props {
  songs: Song[];
}

export function TrendingSongs({ songs }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Trending Songs</ThemedText>
      {songs.map(song => (
        <TouchableOpacity key={song.id} style={styles.songItem}>
          <View style={styles.songInfo}>
            <ThemedText type="defaultSemiBold">{song.title}</ThemedText>
            <ThemedText>{song.artist}</ThemedText>
          </View>
          <IconSymbol name="play.fill" size={24} color="#0a7ea4" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  songInfo: {
    flex: 1,
  },
});
