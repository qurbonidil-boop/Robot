import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { ListRow, Badge, EmptyState } from '@/components';
import { colors } from '@/theme/colors';
import { teachers, getStudentsByTeacher, teacherAveragePercent } from '@/data';

export default function TeachersListScreen() {
  return (
    <View style={styles.flex}>
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState text="Муаллим ёфт нашуд." />}
        renderItem={({ item }) => {
          const count = getStudentsByTeacher(item.id).length;
          const avg = teacherAveragePercent(item.id);
          return (
            <Link href={`/(tabs)/teachers/${item.id}`} asChild>
              <ListRow
                title={item.name}
                subtitle={`${item.subject} · ${count} довталаб`}
                avatarColor={item.avatarColor}
                onPress={() => {}}
                right={<Badge text={`${avg}%`} tone="info" />}
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
  list: { padding: 16, paddingBottom: 40 },
});
