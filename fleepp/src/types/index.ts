export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
  refId: string | null; // links to teacherId / studentId / parentId (null for admin)
  avatarColor: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  bio: string;
  experienceYears: number;
  groupIds: string[];
  avatarColor: string;
}

export interface Group {
  id: string;
  name: string;
  subjectFocus: string;
  teacherId: string;
  studentIds: string[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  groupId: string;
  teacherId: string;
  parentId: string;
  phone: string;
  joinedDate: string; // ISO date
  totalPoints: number; // aggregate ММТ-style score
  avatarColor: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  subject: string;
  testName: string;
  date: string; // ISO date
  score: number;
  maxScore: number;
}

export type ParentRelation = 'Падар' | 'Модар' | 'Сарпараст';

export interface Parent {
  id: string;
  name: string;
  relation: ParentRelation;
  studentId: string;
  phone: string;
  phoneConfirmed: boolean;
  contactPermission: boolean;
}

export type SmsStatus = 'фиристода шуд' | 'дастрас шуд' | 'дар роҳ' | 'ноком шуд';

export interface SmsMessage {
  id: string;
  studentId: string;
  parentId: string;
  text: string;
  sentAt: string; // ISO datetime
  sentByUserId: string;
  status: SmsStatus;
}

export interface AchievementItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  emoji: string;
  caption: string;
}
