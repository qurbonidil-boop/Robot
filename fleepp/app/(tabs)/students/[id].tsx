import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Avatar, Card, StatTile, Badge, ProgressLineChart, EmptyState } from '@/components';
import { colors } from '@/theme/colors';
import {
  getStudent,
  getGroup,
  getTeacher,
  getParentByStudent,
  getResultsForStudent,
  getAveragePercent,
  rankedStudents,
  students,
} from '@/data';

export default function StudentProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const student = getStudent(id);

  if (!student) {
    return <EmptyState text="Довталаб ёфт нашуд." />;
  }

  const group = getGroup(student.groupId);
  const teacher = getTeacher(student.teacherId);
  const parent = getParentByStudent(student.id);
  const results = getResultsForStudent(student.id);
  const avg = getAveragePercent(student.id);
  const rank = rankedStudents().findIndex((s) => s.id === student.id) + 1;

  const canSendSms = user?.role === 'admin';
  const canSeeContact = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <>
      <Stack.Screen options={{ title: `${student.firstName} ${student.lastName}` }} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <Card style={styles.headerCard}>
          <Avatar name={`${student.firstName} ${student.lastName}`} color={student.avatarColor} size={64} />
          <Text style={styles.name}>
            {student.firstName} {student.lastName}
          </Text>
          <Text style={styles.meta}>
            {group?.name} · {group?.subjectFocus}
          </Text>
          <Badge text={`Рейтинг #${rank} аз ${students.length}`} tone="info" />
        </Card>

        <View style={styles.grid}>
          <StatTile label="Ҷамъи баллҳо" value={student.totalPoints} icon="🏆" tint={colors.success} />
          <StatTile label="Миёнаи натиҷа" value={`${avg}%`} icon="📈" tint={colors.info} />
          <StatTile label="Муаллим" value={teacher?.name ?? '-'} icon="👨‍🏫" tint={colors.accent} />
          <StatTile label="Санаи қабул" value={student.joinedDate} icon="📅" />
        </View>

        <Text style={styles.sectionTitle}>Графики пешрафт</Text>
        <Card>
          <ProgressLineChart
            labels={results.map((r) => r.testName.replace('Санҷиши ', '').split(' ')[0])}
            values={results.map((r) => Math.round((r.score / r.maxScore) * 100))}
            tint={student.avatarColor}
          />
        </Card>

        <Text style={styles.sectionTitle}>Натиҷаҳои ҳамаи санҷишҳо</Text>
        <Card style={{ gap: 10 }}>
          {results.map((r) => (
            <View key={r.id} style={styles.resultRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultName}>{r.testName}</Text>
                <Text style={styles.resultMeta}>
                  {r.subject} · {r.date}
                </Text>
              </View>
              <Badge
                text={`${r.score}/${r.maxScore}`}
                tone={r.score / r.maxScore >= 0.7 ? 'success' : r.score / r.maxScore >= 0.5 ? 'warning' : 'danger'}
              />
            </View>
          ))}
        </Card>

        {canSeeContact && parent ? (
          <>
            <Text style={styles.sectionTitle}>Волидайн</Text>
            <Card style={{ gap: 8 }}>
              <Row label="Ном" value={parent.name} />
              <Row label="Хеш" value={parent.relation} />
              <Row label="Телефон" value={parent.phone} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Иҷозати алоқа</Text>
                <Badge
                  text={parent.contactPermission ? 'Дода шудааст' : 'Дода нашудааст'}
                  tone={parent.contactPermission ? 'success' : 'warning'}
                />
              </View>
            </Card>
          </>
        ) : null}

        {canSendSms && parent ? (
          <Link
            href={{ pathname: '/(tabs)/sms', params: { studentId: student.id } }}
            asChild
          >
            <Text style={styles.smsButton}>📨 Ба волидайн SMS фиристодан</Text>
          </Link>
        ) : null}
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
  meta: { fontSize: 13, color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  resultName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  resultMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 13, color: colors.textSecondary },
  infoValue: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  smsButton: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    textAlign: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 14,
    marginTop: 4,
  },
});
