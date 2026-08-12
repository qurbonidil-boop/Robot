import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { StatTile, Card, ListRow, Badge, ProgressBar } from '@/components';
import { colors } from '@/theme/colors';
import {
  students,
  teachers,
  groups,
  rankedStudents,
  getStudentsByTeacher,
  getAveragePercent,
  getStudent,
  getParent,
  getGroup,
  getTeacher,
  teacherAveragePercent,
} from '@/data';

export default function DashboardScreen() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'teacher' && user.refId && <TeacherDashboard teacherId={user.refId} />}
      {user.role === 'student' && user.refId && <StudentDashboard studentId={user.refId} />}
      {user.role === 'parent' && user.refId && <ParentDashboard parentId={user.refId} />}
    </ScrollView>
  );
}

function AdminDashboard() {
  const overallAvg = Math.round(
    students.reduce((sum, s) => sum + getAveragePercent(s.id), 0) / students.length
  );
  const top5 = rankedStudents().slice(0, 5);

  return (
    <>
      <Text style={styles.sectionTitle}>Кӯтоҳи система</Text>
      <View style={styles.grid}>
        <StatTile label="Довталабон" value={students.length} icon="🎓" />
        <StatTile label="Гурӯҳҳо" value={groups.length} icon="📚" tint={colors.info} />
        <StatTile label="Муаллимон" value={teachers.length} icon="👨‍🏫" tint={colors.accent} />
        <StatTile label="Миёнаи натиҷа" value={`${overallAvg}%`} icon="📈" tint={colors.success} />
      </View>

      <Text style={styles.sectionTitle}>Рейтинги беҳтарин 5 довталаб</Text>
      <Card>
        {top5.map((s, index) => (
          <View key={s.id} style={styles.rankRow}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
            <Link href={`/(tabs)/students/${s.id}`} style={styles.rankName}>
              {s.firstName} {s.lastName}
            </Link>
            <Badge text={`${s.totalPoints} балл`} tone="success" />
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Натиҷаи гурӯҳҳо</Text>
      <Card style={{ gap: 14 }}>
        {groups.map((g) => (
          <ProgressBar
            key={g.id}
            label={`${g.name} · ${g.subjectFocus}`}
            percent={Math.round(
              g.studentIds
                .map((id) => getAveragePercent(id))
                .reduce((a, b) => a + b, 0) / g.studentIds.length
            )}
          />
        ))}
      </Card>
    </>
  );
}

function TeacherDashboard({ teacherId }: { teacherId: string }) {
  const teacher = getTeacher(teacherId);
  const myStudents = getStudentsByTeacher(teacherId);
  const avg = teacherAveragePercent(teacherId);

  return (
    <>
      <Text style={styles.sectionTitle}>Гурӯҳи шумо</Text>
      <View style={styles.grid}>
        <StatTile label="Донишҷӯён" value={myStudents.length} icon="🎓" />
        <StatTile label="Фан" value={teacher?.subject ?? '-'} icon="📘" tint={colors.info} />
        <StatTile label="Миёнаи натиҷа" value={`${avg}%`} icon="📈" tint={colors.success} />
        <StatTile label="Таҷриба" value={`${teacher?.experienceYears ?? 0} сол`} icon="🏅" tint={colors.accent} />
      </View>

      <Text style={styles.sectionTitle}>Довталабони ман</Text>
      {myStudents
        .slice()
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((s) => (
          <ListRow
            key={s.id}
            title={`${s.firstName} ${s.lastName}`}
            subtitle={`${getAveragePercent(s.id)}% миёна · ${s.totalPoints} балл`}
            avatarColor={s.avatarColor}
            onPress={() => {}}
            right={
              <Link href={`/(tabs)/students/${s.id}`} asChild>
                <Text style={styles.link}>Дидан →</Text>
              </Link>
            }
          />
        ))}
    </>
  );
}

function StudentDashboard({ studentId }: { studentId: string }) {
  const student = getStudent(studentId);
  if (!student) return null;
  const avg = getAveragePercent(studentId);
  const group = getGroup(student.groupId);
  const teacher = getTeacher(student.teacherId);
  const rank = rankedStudents().findIndex((s) => s.id === studentId) + 1;

  return (
    <>
      <Card style={styles.heroCard}>
        <Text style={styles.heroLabel}>Ҷамъи баллҳо</Text>
        <Text style={styles.heroValue}>{student.totalPoints}</Text>
        <Text style={styles.heroSub}>Рейтинги умумӣ: #{rank} аз {students.length}</Text>
      </Card>

      <View style={styles.grid}>
        <StatTile label="Миёнаи натиҷа" value={`${avg}%`} icon="📈" tint={colors.success} />
        <StatTile label="Гурӯҳ" value={group?.name ?? '-'} icon="📚" tint={colors.info} />
        <StatTile label="Муаллим" value={teacher?.name ?? '-'} icon="👨‍🏫" tint={colors.accent} />
        <StatTile label="Фан" value={group?.subjectFocus ?? '-'} icon="📘" />
      </View>

      <Link href={`/(tabs)/students/${student.id}`} asChild>
        <Text style={styles.linkButton}>Профили пурраи худро дидан →</Text>
      </Link>
    </>
  );
}

function ParentDashboard({ parentId }: { parentId: string }) {
  const parent = getParent(parentId);
  const student = parent ? getStudent(parent.studentId) : undefined;
  if (!parent || !student) return null;
  const avg = getAveragePercent(student.id);
  const group = getGroup(student.groupId);

  return (
    <>
      <Text style={styles.sectionTitle}>Фарзанди шумо</Text>
      <ListRow
        title={`${student.firstName} ${student.lastName}`}
        subtitle={`${group?.name ?? ''} · ${avg}% миёна`}
        avatarColor={student.avatarColor}
        right={
          <Link href={`/(tabs)/students/${student.id}`} asChild>
            <Text style={styles.link}>Профил →</Text>
          </Link>
        }
      />

      <Text style={styles.sectionTitle}>Ҳолати алоқа</Text>
      <Card style={{ gap: 10 }}>
        <Row label="Рақами тасдиқшуда" value={parent.phoneConfirmed ? 'Бале' : 'Не'} good={parent.phoneConfirmed} />
        <Row label="Иҷозати алоқа" value={parent.contactPermission ? 'Дода шудааст' : 'Дода нашудааст'} good={parent.contactPermission} />
      </Card>

      <Link href="/(tabs)/sms" asChild>
        <Text style={styles.linkButton}>Таърихи SMS-ро дидан →</Text>
      </Link>
    </>
  );
}

function Row({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Badge text={value} tone={good ? 'success' : 'warning'} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rankNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textMuted,
    width: 20,
  },
  rankName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  linkButton: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 12,
  },
  heroCard: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    gap: 4,
  },
  heroLabel: {
    color: '#D9EFE9',
    fontSize: 13,
  },
  heroValue: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
  },
  heroSub: {
    color: '#D9EFE9',
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
