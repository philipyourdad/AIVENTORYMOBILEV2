import { PropsWithChildren } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/themed-view';

type CardProps = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
}>;

export function Card({ children, style, padded = true }: CardProps) {
  return (
    <ThemedView style={[styles.card, padded && styles.padded, style as any]}> 
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  padded: {
    padding: 12,
  },
});




