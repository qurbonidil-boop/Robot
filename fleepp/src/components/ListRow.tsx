import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { colors } from '@/theme/colors';

interface ListRowProps {
  title: string;
  subtitle?: string;
  avatarColor?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}

export function ListRow({ title, subtitle, avatarColor, right, onPress }: ListRowProps) {
  const content = (
    <Card style={styles.card}>
      <Avatar name={title} color={avatarColor} />
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </Card>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
