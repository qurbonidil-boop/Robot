import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';
import { LogoutButton } from '@/components';

export default function TeachersStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.textPrimary, fontWeight: '700' },
        headerRight: () => <LogoutButton />,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Муаллимон' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
