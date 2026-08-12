import { Group } from '@/types';

export const groups: Group[] = [
  {
    id: 'g1',
    name: 'Гурӯҳи А-1',
    subjectFocus: 'Математика',
    teacherId: 't1',
    studentIds: ['s1', 's2', 's3', 's4'],
  },
  {
    id: 'g2',
    name: 'Гурӯҳи Б-2',
    subjectFocus: 'Забони англисӣ',
    teacherId: 't2',
    studentIds: ['s5', 's6', 's7', 's8'],
  },
  {
    id: 'g3',
    name: 'Гурӯҳи В-1',
    subjectFocus: 'Физика',
    teacherId: 't3',
    studentIds: ['s9', 's10', 's11', 's12'],
  },
  {
    id: 'g4',
    name: 'Гурӯҳи Г-2',
    subjectFocus: 'Химия',
    teacherId: 't4',
    studentIds: ['s13', 's14', 's15', 's16'],
  },
];
