import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getParent } from '@/data';

export default function ProfileRedirect() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;

  if (user.role === 'student' && user.refId) {
    return <Redirect href={`/(tabs)/students/${user.refId}`} />;
  }
  if (user.role === 'teacher' && user.refId) {
    return <Redirect href={`/(tabs)/teachers/${user.refId}`} />;
  }
  if (user.role === 'parent' && user.refId) {
    const parent = getParent(user.refId);
    if (parent) {
      return <Redirect href={`/(tabs)/students/${parent.studentId}`} />;
    }
  }
  return <Redirect href="/(tabs)/dashboard" />;
}
