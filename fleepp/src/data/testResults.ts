import { TestResult } from '@/types';
import { students } from './students';
import { groups } from './groups';

const subjectByGroup: Record<string, string> = Object.fromEntries(
  groups.map((g) => [g.id, g.subjectFocus])
);

const testStages = [
  { suffix: 'Санҷиши I', monthOffset: 0 },
  { suffix: 'Санҷиши II', monthOffset: 1 },
  { suffix: 'Санҷиши III', monthOffset: 2 },
  { suffix: 'Санҷиши IV (ММТ-тачрибавӣ)', monthOffset: 3 },
];

// Deterministic pseudo-random generator so mock scores stay stable across reloads.
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildResultsForStudent(studentId: string, seedBase: number, subject: string): TestResult[] {
  return testStages.map((stage, index) => {
    const maxScore = 100;
    const trendBoost = index * 3; // gentle upward trend to show progress
    const noise = Math.floor(seededRandom(seedBase + index) * 25);
    const score = Math.min(maxScore, 45 + trendBoost + noise);
    const date = new Date(2025, 9 + stage.monthOffset, 10 + index * 2).toISOString().slice(0, 10);
    return {
      id: `${studentId}-r${index + 1}`,
      studentId,
      subject,
      testName: stage.suffix,
      date,
      score,
      maxScore,
    };
  });
}

export const testResults: TestResult[] = students.flatMap((student, i) =>
  buildResultsForStudent(student.id, (i + 1) * 17, subjectByGroup[student.groupId] ?? 'Умумӣ')
);

export function getResultsForStudent(studentId: string): TestResult[] {
  return testResults
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getAveragePercent(studentId: string): number {
  const results = getResultsForStudent(studentId);
  if (results.length === 0) return 0;
  const totalPct = results.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0);
  return Math.round(totalPct / results.length);
}
