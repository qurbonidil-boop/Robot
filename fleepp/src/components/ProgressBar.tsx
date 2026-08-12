import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface ProgressBarProps {
  percent: number; // 0-100
  label?: string;
  tint?: string;
}

export function ProgressBar({ percent, label, tint = colors.primary }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.wrap}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.percent, { color: tint }]}>{clamped}%</Text>
        </View>
      ) : null}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: tint }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  percent: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
