import { students } from './students';
import { teachers } from './teachers';
import { groups } from './groups';
import { parents } from './parents';
import { getAveragePercent } from './testResults';

export * from './students';
export * from './teachers';
export * from './groups';
export * from './parents';
export * from './testResults';
export * from './sms';
export * from './users';
export * from './about';

export function getStudent(id: string) {
  return students.find((s) => s.id === id);
}

export function getTeacher(id: string) {
  return teachers.find((t) => t.id === id);
}

export function getGroup(id: string) {
  return groups.find((g) => g.id === id);
}

export function getParent(id: string) {
  return parents.find((p) => p.id === id);
}

export function getParentByStudent(studentId: string) {
  return parents.find((p) => p.studentId === studentId);
}

export function getStudentsByGroup(groupId: string) {
  return students.filter((s) => s.groupId === groupId);
}

export function getStudentsByTeacher(teacherId: string) {
  return students.filter((s) => s.teacherId === teacherId);
}

export function studentFullName(id: string): string {
  const s = getStudent(id);
  return s ? `${s.firstName} ${s.lastName}` : 'Номаълум';
}

export function rankedStudents() {
  return [...students].sort((a, b) => b.totalPoints - a.totalPoints);
}

export function groupAveragePercent(groupId: string): number {
  const list = getStudentsByGroup(groupId);
  if (list.length === 0) return 0;
  const total = list.reduce((sum, s) => sum + getAveragePercent(s.id), 0);
  return Math.round(total / list.length);
}

export function teacherAveragePercent(teacherId: string): number {
  const list = students.filter((s) => s.teacherId === teacherId);
  if (list.length === 0) return 0;
  const total = list.reduce((sum, s) => sum + getAveragePercent(s.id), 0);
  return Math.round(total / list.length);
}
