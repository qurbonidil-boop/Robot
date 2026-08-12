import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import { SmsProvider } from '@/context/SmsContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SmsProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SmsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
