import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface BadgeProps {
  text: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const toneColors: Record<NonNullable<BadgeProps['tone']>, { bg: string; fg: string }> = {
  success: { bg: 'rgba(52, 211, 153, 0.16)', fg: '#34D399' },
  warning: { bg: 'rgba(251, 191, 36, 0.16)', fg: '#FBBF24' },
  danger: { bg: 'rgba(248, 113, 113, 0.16)', fg: '#F87171' },
  info: { bg: 'rgba(96, 165, 250, 0.16)', fg: '#60A5FA' },
  neutral: { bg: colors.border, fg: colors.textSecondary },
};

export function Badge({ text, tone = 'neutral' }: BadgeProps) {
  const c = toneColors[tone];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
