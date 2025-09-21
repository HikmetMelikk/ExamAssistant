import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exam, ExamResult } from '../types';

const STORAGE_KEY = 'exams';

const generateId = () => `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

async function getExams(): Promise<Exam[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: Exam[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read exams:', e);
    return [];
  }
}

async function saveExams(exams: Exam[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
  } catch (e) {
    console.error('Failed to save exams:', e);
  }
}

function computeTotalNet(results: ExamResult[]): number {
  return results.reduce((sum, r) => sum + (r.net ?? (r.correct - r.wrong / 4)), 0);
}

async function addExam(partial: Omit<Exam, 'id' | 'createdAt' | 'totalNet'>): Promise<Exam> {
  const exams = await getExams();
  const totalNet = computeTotalNet(partial.results);
  const newExam: Exam = {
    ...partial,
    id: generateId(),
    createdAt: new Date().toISOString(),
    totalNet,
  };
  const updated = [newExam, ...exams];
  await saveExams(updated);
  return newExam;
}

export const examStore = {
  getExams,
  addExam,
  saveExams,
};

