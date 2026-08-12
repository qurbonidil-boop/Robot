import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useSms } from '@/context/SmsContext';
import { Avatar, Badge, Card, ListRow, TextField, Button, EmptyState, ScreenHeader } from '@/components';
import { colors } from '@/theme/colors';
import { students, getStudent, getParentByStudent, getParent } from '@/data';
import { SmsStatus } from '@/types';

const statusTone: Record<SmsStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  'дастрас шуд': 'success',
  'фиристода шуд': 'info',
  'дар роҳ': 'warning',
  'ноком шуд': 'danger',
};

export default function SmsScreen() {
  const { user } = useAuth();
  const { studentId: paramStudentId } = useLocalSearchParams<{ studentId?: string }>();
  const { messagesForStudent, sendSms } = useSms();
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isParent = user?.role === 'parent';

  const parentOwnStudentId = useMemo(() => {
    if (!isParent || !user?.refId) return undefined;
    return getParent(user.refId)?.studentId;
  }, [isParent, user]);

  const [selectedId, setSelectedId] = useState<string | undefined>(
    paramStudentId ?? parentOwnStudentId
  );

  const selectedStudent = selectedId ? getStudent(selectedId) : undefined;
  const selectedParent = selectedId ? getParentByStudent(selectedId) : undefined;
  const history = selectedId ? messagesForStudent(selectedId) : [];

  if (!user) return null;

  // Admin without a selection yet: show a picker of students.
  if (isAdmin && !selectedStudent) {
    const filtered = students.filter((s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.trim().toLowerCase())
    );
    return (
      <View style={styles.flex}>
        <View style={styles.padTop}>
          <ScreenHeader title="SMS" subtitle="Аввал довталабро интихоб кунед" />
          <TextField label="Ҷустуҷӯ" placeholder="Номи довталаб..." value={query} onChangeText={setQuery} />
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState text="Довталаб ёфт нашуд." />}
          renderItem={({ item }) => (
            <ListRow
              title={`${item.firstName} ${item.lastName}`}
              subtitle={getParentByStudent(item.id)?.name ?? ''}
              avatarColor={item.avatarColor}
              onPress={() => setSelectedId(item.id)}
            />
          )}
        />
      </View>
    );
  }

  if (!selectedStudent || !selectedParent) {
    return <EmptyState icon="👨‍👩‍👦" text="Барои дидани таърихи SMS фарзанди худро пайваст кунед." />;
  }

  function handleSend() {
    if (!text.trim() || !selectedStudent || !selectedParent || !user) return;
    setSending(true);
    sendSms({
      studentId: selectedStudent.id,
      parentId: selectedParent.id,
      text: text.trim(),
      sentByUserId: user.id,
    });
    setText('');
    setSending(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isAdmin ? (
          <Pressable onPress={() => setSelectedId(undefined)}>
            <Text style={styles.changeLink}>← Иваз кардани довталаб</Text>
          </Pressable>
        ) : null}

        <Card style={styles.recipientCard}>
          <Avatar name={selectedStudent.firstName + ' ' + selectedStudent.lastName} color={selectedStudent.avatarColor} />
          <View style={{ flex: 1 }}>
            <Text style={styles.recipientName}>
              {selectedStudent.firstName} {selectedStudent.lastName}
            </Text>
            <Text style={styles.recipientSub}>
              {selectedParent.name} · {selectedParent.phone}
            </Text>
          </View>
          <Badge
            text={selectedParent.contactPermission ? 'Иҷозат дода шуд' : 'Иҷозат нест'}
            tone={selectedParent.contactPermission ? 'success' : 'danger'}
          />
        </Card>

        {isAdmin ? (
          <Card style={styles.composeCard}>
            <TextField
              label="Хабар"
              placeholder="Матни SMS-ро нависед..."
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={4}
              style={styles.textarea}
            />
            <Button
              label="Фиристодан"
              onPress={handleSend}
              loading={sending}
              disabled={!text.trim() || !selectedParent.contactPermission}
            />
            {!selectedParent.contactPermission ? (
              <Text style={styles.warning}>
                Волидайн иҷозати алоқа надодаанд, аммо шумо метавонед пас аз тасдиқ фиристед.
              </Text>
            ) : null}
          </Card>
        ) : null}

        <Text style={styles.sectionTitle}>Таърихи хабарҳо</Text>
        {history.length === 0 ? (
          <EmptyState icon="📭" text="Ҳанӯз ягон SMS фиристода нашудааст." />
        ) : (
          history.map((m) => (
            <Card key={m.id} style={styles.msgCard}>
              <Text style={styles.msgText}>{m.text}</Text>
              <View style={styles.msgFooter}>
                <Text style={styles.msgDate}>{new Date(m.sentAt).toLocaleString('tg-TJ')}</Text>
                <Badge text={m.status} tone={statusTone[m.status]} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  padTop: { padding: 16, gap: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  changeLink: { color: colors.primary, fontWeight: '600', fontSize: 13, marginBottom: 4 },
  recipientCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recipientName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  recipientSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  composeCard: { gap: 12 },
  textarea: { height: 90, textAlignVertical: 'top', paddingTop: 12 },
  warning: { fontSize: 12, color: colors.warning },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  msgCard: { gap: 8 },
  msgText: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  msgFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  msgDate: { fontSize: 11, color: colors.textMuted },
});
