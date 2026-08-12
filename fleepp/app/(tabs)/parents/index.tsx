import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Card, Avatar, Badge, EmptyState } from '@/components';
import { colors } from '@/theme/colors';
import { parents, getStudent } from '@/data';

export default function ParentsListScreen() {
  return (
    <View style={styles.flex}>
      <FlatList
        data={parents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState text="Волидайн ёфт нашуд." />}
        renderItem={({ item }) => {
          const student = getStudent(item.studentId);
          return (
            <Link href={{ pathname: '/(tabs)/sms', params: { studentId: item.studentId } }} asChild>
              <Card style={styles.row}>
                <Avatar name={item.name} color={student?.avatarColor} />
                <View style={styles.textWrap}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub}>
                    {item.relation} · {student ? `${student.firstName} ${student.lastName}` : ''}
                  </Text>
                  <Text style={styles.phone}>{item.phone}</Text>
                </View>
                <View style={styles.badges}>
                  <Badge
                    text={item.phoneConfirmed ? 'Рақам тасдиқшуда' : 'Тасдиқ нашуда'}
                    tone={item.phoneConfirmed ? 'success' : 'warning'}
                  />
                  <Badge
                    text={item.contactPermission ? 'Иҷозат ✓' : 'Иҷозат ✗'}
                    tone={item.contactPermission ? 'success' : 'danger'}
                  />
                </View>
              </Card>
            </Link>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, paddingBottom: 40, gap: 10 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  textWrap: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  sub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  phone: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badges: { alignItems: 'flex-end', gap: 6 },
});
