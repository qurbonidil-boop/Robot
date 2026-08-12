import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { colors, roleLabels } from '@/theme/colors';
import { LogoutButton } from '@/components';

export default function TabsLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  const isAdmin = user.role === 'admin';
  const isTeacher = user.role === 'teacher';
  const canSeeStudents = isAdmin || isTeacher;
  const canSeeProfile = user.role !== 'admin';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.textPrimary, fontWeight: '700' },
        headerRight: () => <LogoutButton />,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Асосӣ',
          headerTitle: `Хуш омадед, ${user.name}`,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: 'Довталабон',
          href: canSeeStudents ? undefined : null,
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="teachers"
        options={{
          title: 'Муаллимон',
          href: isAdmin ? undefined : null,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="parents"
        options={{
          title: 'Волидайн',
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sms"
        options={{
          title: 'SMS',
          href: isAdmin || user.role === 'parent' ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Статистика',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: roleLabels[user.role],
          headerTitle: 'Профили ман',
          href: canSeeProfile ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'FLEEPP',
          headerTitle: 'Дар бораи FLEEPP',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export const unstable_settings = {
  initialRouteName: 'dashboard',
};
