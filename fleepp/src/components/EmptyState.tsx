import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface EmptyStateProps {
  icon?: string;
  text: string;
}

export function EmptyState({ icon = '📭', text }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  icon: {
    fontSize: 32,
  },
  text: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
