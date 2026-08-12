import { User } from '@/types';

export const users: User[] = [
  {
    id: 'u-admin',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Админи марказ',
    refId: null,
    avatarColor: '#0F5F4F',
  },
  { id: 'u-t1', username: 'a.rahimov', password: 'teacher123', role: 'teacher', name: 'Аслам Раҳимов', refId: 't1', avatarColor: '#2F6F5E' },
  { id: 'u-t2', username: 'g.saidova', password: 'teacher123', role: 'teacher', name: 'Гулнора Саидова', refId: 't2', avatarColor: '#B45309' },
  { id: 'u-t3', username: 'f.karimov', password: 'teacher123', role: 'teacher', name: 'Фаридун Каримов', refId: 't3', avatarColor: '#1D4ED8' },
  { id: 'u-t4', username: 'm.yusupova', password: 'teacher123', role: 'teacher', name: 'Мадина Юсупова', refId: 't4', avatarColor: '#9333EA' },
  { id: 'u-s1', username: 'orien.n', password: 'student123', role: 'student', name: 'Ориён Назаров', refId: 's1', avatarColor: '#2F6F5E' },
  { id: 'u-s6', username: 'farzona.q', password: 'student123', role: 'student', name: 'Фарзона Қурбонова', refId: 's6', avatarColor: '#0891B2' },
  { id: 'u-s9', username: 'umed.h', password: 'student123', role: 'student', name: 'Умед Ҳакимов', refId: 's9', avatarColor: '#2F6F5E' },
  { id: 'u-s14', username: 'sitora.y', password: 'student123', role: 'student', name: 'Ситора Юсупова', refId: 's14', avatarColor: '#0891B2' },
  { id: 'u-p1', username: 'fayzullo.n', password: 'parent123', role: 'parent', name: 'Файзулло Назаров', refId: 'p1', avatarColor: '#2F6F5E' },
  { id: 'u-p6', username: 'munira.q', password: 'parent123', role: 'parent', name: 'Мунира Қурбонова', refId: 'p6', avatarColor: '#0891B2' },
  { id: 'u-p9', username: 'hakim.h', password: 'parent123', role: 'parent', name: 'Ҳаким Ҳакимов', refId: 'p9', avatarColor: '#2F6F5E' },
  { id: 'u-p14', username: 'salima.y', password: 'parent123', role: 'parent', name: 'Салима Юсупова', refId: 'p14', avatarColor: '#0891B2' },
];

export function findUser(username: string, password: string): User | undefined {
  return users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
  );
}
