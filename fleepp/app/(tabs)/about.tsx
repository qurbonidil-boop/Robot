import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, ScreenHeader, Avatar } from '@/components';
import { colors } from '@/theme/colors';
import { centerInfo, achievements, gallery, teachers } from '@/data';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🏫</Text>
        <Text style={styles.heroTitle}>{centerInfo.name}</Text>
        <Text style={styles.heroSubtitle}>{centerInfo.fullName}</Text>
      </View>

      <ScreenHeader title="Таърих" />
      <Card>
        <Text style={styles.paragraph}>{centerInfo.history}</Text>
      </Card>

      <ScreenHeader title="Мақсад" />
      <Card>
        <Text style={styles.paragraph}>{centerInfo.mission}</Text>
      </Card>

      <ScreenHeader title="Муаллимон" />
      <Card style={{ gap: 12 }}>
        {teachers.map((t) => (
          <View key={t.id} style={styles.teacherRow}>
            <Avatar name={t.name} color={t.avatarColor} />
            <View>
              <Text style={styles.teacherName}>{t.name}</Text>
              <Text style={styles.teacherSubject}>{t.subject}</Text>
            </View>
          </View>
        ))}
      </Card>

      <ScreenHeader title="Дастовардҳо" />
      <Card style={{ gap: 12 }}>
        {achievements.map((a) => (
          <View key={a.id} style={styles.achievementRow}>
            <View style={styles.yearPill}>
              <Text style={styles.yearText}>{a.year}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.achievementTitle}>{a.title}</Text>
              <Text style={styles.achievementDesc}>{a.description}</Text>
            </View>
          </View>
        ))}
      </Card>

      <ScreenHeader title="Галерея" />
      <View style={styles.galleryGrid}>
        {gallery.map((g) => (
          <Card key={g.id} style={styles.galleryCard}>
            <Text style={styles.galleryEmoji}>{g.emoji}</Text>
            <Text style={styles.galleryCaption}>{g.caption}</Text>
          </Card>
        ))}
      </View>

      <ScreenHeader title="Тамос" />
      <Card style={{ gap: 8 }}>
        <ContactRow icon="📍" text={centerInfo.address} />
        <ContactRow icon="📞" text={centerInfo.phone} />
        <ContactRow icon="✉️" text={centerInfo.email} />
        <ContactRow icon="🕒" text={centerInfo.workingHours} />
      </Card>
    </ScrollView>
  );
}

function ContactRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.contactRow}>
      <Text style={styles.contactIcon}>{icon}</Text>
      <Text style={styles.contactText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 10 },
  hero: { alignItems: 'center', gap: 4, marginBottom: 8 },
  heroEmoji: { fontSize: 40 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: colors.primary },
  heroSubtitle: { fontSize: 13, color: colors.textSecondary },
  paragraph: { fontSize: 14, color: colors.textPrimary, lineHeight: 21 },
  teacherRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  teacherName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  teacherSubject: { fontSize: 12, color: colors.textSecondary },
  achievementRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  yearPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  yearText: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
  achievementTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  achievementDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  galleryCard: { flexBasis: '30%', flexGrow: 1, alignItems: 'center', gap: 6 },
  galleryEmoji: { fontSize: 28 },
  galleryCaption: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
  contactRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  contactIcon: { fontSize: 16 },
  contactText: { fontSize: 13, color: colors.textPrimary },
});
