export interface User {
  id: string;
  email: string;
  name: string;
  examType: ExamType;
  aytField?: AYTField;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  createdAt: string;
  userId: string;
  totalNet: number;
  results: ExamResult[];
}

export interface ExamResult {
  id: string;
  examId: string;
  lesson: string;
  correct: number;
  wrong: number;
  empty: number;
  net: number;
}

export enum ExamType {
  TYT = 'TYT',
  AYT = 'AYT',
}

export enum AYTField {
  SAYISAL = 'SAYISAL',
  ESIT_AGIRLIK = 'ESIT_AGIRLIK',
  SOZEL = 'SOZEL',
  DIL = 'DIL',
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  examType: ExamType;
  aytField?: AYTField;
}

export interface LoginData {
  email: string;
  password: string;
}