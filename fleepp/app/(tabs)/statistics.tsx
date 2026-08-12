import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Card, StatTile, ScreenHeader, ProgressBar, ProgressLineChart, Badge } from '@/components';
import { colors } from '@/theme/colors';
import {
  students,
  teachers,
  groups,
  testResults,
  rankedStudents,
  getAveragePercent,
  groupAveragePercent,
  teacherAveragePercent,
  getStudentsByTeacher,
  getStudent,
  getParent,
  getGroup,
} from '@/data';

export default function StatisticsScreen() {
  const { user } = useAuth();
  if (!user) return null;

  const isStaff = user.role === 'admin' || user.role === 'teacher';

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      {isStaff ? <StaffStatistics scopedTeacherId={user.role === 'teacher' ? user.refId ?? undefined : undefined} /> : <PersonalStatistics role={user.role} refId={user.refId} />}
    </ScrollView>
  );
}

function stageProgress(filterIds?: string[]) {
  const relevant = filterIds ? testResults.filter((r) => filterIds.includes(r.studentId)) : testResults;
  const byStage = new Map<string, { total: number; count: number }>();
  relevant.forEach((r) => {
    const entry = byStage.get(r.testName) ?? { total: 0, count: 0 };
    entry.total += (r.score / r.maxScore) * 100;
    entry.count += 1;
    byStage.set(r.testName, entry);
  });
  const labels = Array.from(byStage.keys());
  const values = labels.map((l) => Math.round((byStage.get(l)!.total / byStage.get(l)!.count)));
  return { labels: labels.map((l) => l.replace('Санҷиши ', '').split(' ')[0]), values };
}

function StaffStatistics({ scopedTeacherId }: { scopedTeacherId?: string }) {
  const scopedStudents = scopedTeacherId ? getStudentsByTeacher(scopedTeacherId) : students;
  const overallAvg = Math.round(
    scopedStudents.reduce((s, st) => s + getAveragePercent(st.id), 0) / scopedStudents.length
  );
  const top10 = useMemo(
    () =>
      (scopedTeacherId ? scopedStudents.slice() : rankedStudents()).sort(
        (a, b) => b.totalPoints - a.totalPoints
      ).slice(0, 10),
    [scopedStudents, scopedTeacherId]
  );
  const progress = stageProgress(scopedTeacherId ? scopedStudents.map((s) => s.id) : undefined);
  const relevantGroups = scopedTeacherId ? groups.filter((g) => g.teacherId === scopedTeacherId) : groups;
  const relevantTeachers = scopedTeacherId ? teachers.filter((t) => t.id === scopedTeacherId) : teachers;

  return (
    <>
      <ScreenHeader title="Статистика" subtitle="Натиҷаи умумӣ" />
      <View style={styles.grid}>
        <StatTile label="Довталабон" value={scopedStudents.length} icon="🎓" />
        <StatTile label="Миёнаи натиҷа" value={`${overallAvg}%`} icon="📈" tint={colors.success} />
      </View>

      <Text style={styles.sectionTitle}>Рейтинг</Text>
      <Card>
        {top10.map((s, i) => (
          <View key={s.id} style={styles.rankRow}>
            <Text style={styles.rankNumber}>{i + 1}</Text>
            <Link href={`/(tabs)/students/${s.id}`} style={styles.rankName}>
              {s.firstName} {s.lastName}
            </Link>
            <Badge text={`${s.totalPoints} б.`} tone="success" />
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Натиҷаи гурӯҳҳо</Text>
      <Card style={{ gap: 14 }}>
        {relevantGroups.map((g) => (
          <ProgressBar key={g.id} label={`${g.name} · ${g.subjectFocus}`} percent={groupAveragePercent(g.id)} />
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Пешрафти умумии довталабон</Text>
      <Card>
        <ProgressLineChart labels={progress.labels} values={progress.values} tint={colors.info} />
      </Card>

      <Text style={styles.sectionTitle}>Натиҷаи муаллимон</Text>
      <Card style={{ gap: 14 }}>
        {relevantTeachers.map((t) => (
          <ProgressBar
            key={t.id}
            label={`${t.name} · ${t.subject}`}
            percent={teacherAveragePercent(t.id)}
            tint={colors.accent}
          />
        ))}
      </Card>
    </>
  );
}

function PersonalStatistics({ role, refId }: { role: string; refId: string | null }) {
  const studentId = role === 'student' ? refId ?? undefined : role === 'parent' && refId ? getParent(refId)?.studentId : undefined;
  const student = studentId ? getStudent(studentId) : undefined;

  if (!student) return null;

  const avg = getAveragePercent(student.id);
  const rank = rankedStudents().findIndex((s) => s.id === student.id) + 1;
  const group = getGroup(student.groupId);
  const groupAvg = groupAveragePercent(student.groupId);
  const overallAvg = Math.round(students.reduce((s, st) => s + getAveragePercent(st.id), 0) / students.length);
  const progress = stageProgress([student.id]);

  return (
    <>
      <ScreenHeader title="Статистика" subtitle={`${student.firstName} ${student.lastName}`} />
      <View style={styles.grid}>
        <StatTile label="Рейтинги умумӣ" value={`#${rank}`} icon="🏆" tint={colors.success} />
        <StatTile label="Миёнаи шахсӣ" value={`${avg}%`} icon="📈" tint={colors.info} />
      </View>

      <Text style={styles.sectionTitle}>Муқоиса</Text>
      <Card style={{ gap: 14 }}>
        <ProgressBar label="Натиҷаи шумо / фарзандатон" percent={avg} tint={colors.primary} />
        <ProgressBar label={`Миёнаи гурӯҳ (${group?.name ?? ''})`} percent={groupAvg} tint={colors.info} />
        <ProgressBar label="Миёнаи умумии марказ" percent={overallAvg} tint={colors.accent} />
      </Card>

      <Text style={styles.sectionTitle}>Графики пешрафт</Text>
      <Card>
        <ProgressLineChart labels={progress.labels} values={progress.values} tint={student.avatarColor} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rankNumber: { fontSize: 15, fontWeight: '800', color: colors.textMuted, width: 24 },
  rankName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
});
