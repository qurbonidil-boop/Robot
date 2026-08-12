import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Avatar, Card, StatTile, Badge, ListRow, EmptyState } from '@/components';
import { colors } from '@/theme/colors';
import { getTeacher, getStudentsByTeacher, teacherAveragePercent, getAveragePercent, getGroup } from '@/data';

export default function TeacherProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teacher = getTeacher(id);

  if (!teacher) {
    return <EmptyState text="Муаллим ёфт нашуд." />;
  }

  const myStudents = getStudentsByTeacher(teacher.id);
  const avg = teacherAveragePercent(teacher.id);
  const group = getGroup(teacher.groupIds[0]);

  return (
    <>
      <Stack.Screen options={{ title: teacher.name }} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <Card style={styles.headerCard}>
          <Avatar name={teacher.name} color={teacher.avatarColor} size={64} />
          <Text style={styles.name}>{teacher.name}</Text>
          <Badge text={teacher.subject} tone="info" />
          <Text style={styles.bio}>{teacher.bio}</Text>
        </Card>

        <View style={styles.grid}>
          <StatTile label="Довталабон" value={myStudents.length} icon="🎓" />
          <StatTile label="Гурӯҳ" value={group?.name ?? '-'} icon="📚" tint={colors.info} />
          <StatTile label="Миёнаи натиҷа" value={`${avg}%`} icon="📈" tint={colors.success} />
          <StatTile label="Таҷриба" value={`${teacher.experienceYears} сол`} icon="🏅" tint={colors.accent} />
        </View>

        <Text style={styles.sectionTitle}>Тамос</Text>
        <Card style={{ gap: 8 }}>
          <Row label="Телефон" value={teacher.phone} />
          <Row label="Почта" value={teacher.email} />
        </Card>

        <Text style={styles.sectionTitle}>Донишҷӯёни ин муаллим</Text>
        {myStudents
          .slice()
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map((s) => (
            <Link key={s.id} href={`/(tabs)/students/${s.id}`} asChild>
              <ListRow
                title={`${s.firstName} ${s.lastName}`}
                subtitle={`${getAveragePercent(s.id)}% миёна`}
                avatarColor={s.avatarColor}
                onPress={() => {}}
                right={<Badge text={`${s.totalPoints} б.`} tone="neutral" />}
              />
            </Link>
          ))}
      </ScrollView>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  headerCard: { alignItems: 'center', gap: 6 },
  name: { fontSize: 19, fontWeight: '700', color: colors.textPrimary, marginTop: 6 },
  bio: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 13, color: colors.textSecondary },
  infoValue: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
});
