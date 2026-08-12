import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ListRow, TextField, Badge, EmptyState } from '@/components';
import { colors } from '@/theme/colors';
import { students, getGroup, getAveragePercent, getStudentsByTeacher } from '@/data';

export default function StudentsListScreen() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  const baseList = useMemo(() => {
    if (user?.role === 'teacher' && user.refId) {
      return getStudentsByTeacher(user.refId);
    }
    return students;
  }, [user]);

  const filtered = baseList.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <View style={styles.flex}>
      <View style={styles.searchWrap}>
        <TextField
          label="Ҷустуҷӯи довталаб"
          placeholder="Номро нависед..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <FlatList
        data={filtered.slice().sort((a, b) => b.totalPoints - a.totalPoints)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState text="Довталаб ёфт нашуд." />}
        renderItem={({ item, index }) => {
          const group = getGroup(item.groupId);
          const avg = getAveragePercent(item.id);
          return (
            <Link href={`/(tabs)/students/${item.id}`} asChild>
              <ListRow
                title={`${item.firstName} ${item.lastName}`}
                subtitle={`${group?.name ?? ''} · ${avg}% миёна`}
                avatarColor={item.avatarColor}
                onPress={() => {}}
                right={
                  <View style={styles.rightWrap}>
                    <Text style={styles.rank}>#{index + 1}</Text>
                    <Badge text={`${item.totalPoints} б.`} tone="info" />
                  </View>
                }
              />
            </Link>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  searchWrap: { padding: 16, paddingBottom: 0 },
  list: { padding: 16, paddingBottom: 40 },
  rightWrap: { alignItems: 'flex-end', gap: 4 },
  rank: { fontSize: 12, color: colors.textMuted, fontWeight: '700' },
});
