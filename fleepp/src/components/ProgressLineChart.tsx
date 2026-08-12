import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '@/theme/colors';

interface ProgressLineChartProps {
  labels: string[];
  values: number[]; // percentages 0-100
  tint?: string;
}

const screenWidth = Dimensions.get('window').width;

export function ProgressLineChart({ labels, values, tint = colors.primary }: ProgressLineChartProps) {
  if (values.length === 0) {
    return <Text style={styles.empty}>Ҳанӯз натиҷае мавҷуд нест.</Text>;
  }

  const chartWidth = Math.max(screenWidth - 64, labels.length * 90);

  return (
    <View style={styles.wrap}>
      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={chartWidth}
        height={200}
        fromZero
        yAxisSuffix="%"
        segments={4}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => hexToRgba(tint, opacity),
          labelColor: () => colors.textSecondary,
          propsForDots: { r: '4', strokeWidth: '2', stroke: tint },
          propsForBackgroundLines: { stroke: colors.border },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const styles = StyleSheet.create({
  wrap: {
    marginLeft: -16,
  },
  chart: {
    borderRadius: 12,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
