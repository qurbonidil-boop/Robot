import React from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/colors';

export function LogoutButton() {
  const { logout } = useAuth();
  return (
    <Pressable
      onPress={() => {
        logout();
        router.replace('/login');
      }}
      style={{ marginRight: 16 }}
    >
      <Ionicons name="log-out-outline" size={22} color={colors.textSecondary} />
    </Pressable>
  );
}
