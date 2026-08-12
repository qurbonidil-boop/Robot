import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface BadgeProps {
  text: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const toneColors: Record<NonNullable<BadgeProps['tone']>, { bg: string; fg: string }> = {
  success: { bg: '#DCFCE7', fg: '#15803D' },
  warning: { bg: '#FEF3C7', fg: '#B45309' },
  danger: { bg: '#FEE2E2', fg: '#B91C1C' },
  info: { bg: '#DBEAFE', fg: '#1D4ED8' },
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
