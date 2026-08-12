import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Button, TextField } from '@/components';
import { colors, roleLabels } from '@/theme/colors';
import { users } from '@/data/users';
import { Role } from '@/types';

const roles: Role[] = ['admin', 'teacher', 'student', 'parent'];

export default function LoginScreen() {
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const demoUsers = users.filter((u) => u.role === role);

  function fillDemo(u: (typeof users)[number]) {
    setUsername(u.username);
    setPassword(u.password);
    setError('');
  }

  function handleSubmit() {
    setError('');
    if (!username || !password) {
      setError('Лутфан номи корбар ва рамзро пур кунед.');
      return;
    }
    setSubmitting(true);
    const result = login(username, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? 'Хатогӣ рух дод.');
      return;
    }
    router.replace('/(tabs)/dashboard');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <Text style={styles.logoEmoji}>📱</Text>
          <Text style={styles.appName}>FLEEPP</Text>
          <Text style={styles.tagline}>Education Management App</Text>
        </View>

        <View style={styles.roleRow}>
          {roles.map((r) => {
            const active = r === role;
            return (
              <Pressable
                key={r}
                onPress={() => {
                  setRole(r);
                  setUsername('');
                  setPassword('');
                  setError('');
                }}
                style={[styles.roleChip, active && styles.roleChipActive]}
              >
                <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>
                  {roleLabels[r]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.form}>
          <TextField
            label="Номи корбар"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="масалан admin"
          />
          <TextField
            label="Рамз"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Ворид шудан" onPress={handleSubmit} loading={submitting} />
        </View>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Ҳисобҳои намунавӣ ({roleLabels[role]})</Text>
          {demoUsers.map((u) => (
            <Pressable key={u.id} style={styles.demoRow} onPress={() => fillDemo(u)}>
              <Text style={styles.demoName}>{u.name}</Text>
              <Text style={styles.demoCreds}>
                {u.username} / {u.password}
              </Text>
            </Pressable>
          ))}
          <Text style={styles.demoHint}>Ин лоиҳа прототип аст — маълумот сохта шудааст.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 72,
    gap: 24,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 4,
  },
  logoEmoji: { fontSize: 40 },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  roleChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  roleChipTextActive: {
    color: '#fff',
  },
  form: {
    gap: 14,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
  demoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  demoName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  demoCreds: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  demoHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
});
