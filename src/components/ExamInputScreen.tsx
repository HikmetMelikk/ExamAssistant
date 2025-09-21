import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import Icon from './Icons';
import { AYTField, ExamType, ExamResult } from '../types';
import { useNavigation } from '@react-navigation/native';
import { examStore } from '../services/examStore';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';

interface ExamInputScreenProps {
  onSubmit?: (examData: any) => void;
  onCancel?: () => void;
}

const ExamInputScreen: React.FC<ExamInputScreenProps> = ({onSubmit, onCancel}) => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState<ExamType>(ExamType.TYT);
  const [aytField, setAytField] = useState<AYTField | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const tytSubjects = [
    {key: 'Turkish', label: 'Türkçe', maxQuestions: 40},
    {key: 'Social Sciences', label: 'Sosyal Bilimler', maxQuestions: 20},
    {key: 'Basic Mathematics', label: 'Temel Matematik', maxQuestions: 40},
    {key: 'Science', label: 'Fen Bilimleri', maxQuestions: 20},
  ];

  const aytSubjects = {
    [AYTField.SAYISAL]: [
      {key: 'Mathematics', label: 'Matematik', maxQuestions: 40},
      {key: 'Physics', label: 'Fizik', maxQuestions: 14},
      {key: 'Chemistry', label: 'Kimya', maxQuestions: 13},
      {key: 'Biology', label: 'Biyoloji', maxQuestions: 13},
    ],
    [AYTField.ESIT_AGIRLIK]: [
      {key: 'Mathematics', label: 'Matematik', maxQuestions: 40},
      {key: 'Literature', label: 'Edebiyat', maxQuestions: 24},
      {key: 'History', label: 'Tarih', maxQuestions: 10},
      {key: 'Geography', label: 'Coğrafya', maxQuestions: 6},
    ],
    [AYTField.SOZEL]: [
      {key: 'Literature', label: 'Edebiyat', maxQuestions: 24},
      {key: 'History', label: 'Tarih', maxQuestions: 10},
      {key: 'Geography', label: 'Coğrafya', maxQuestions: 24},
      {key: 'Philosophy', label: 'Felsefe', maxQuestions: 12},
    ],
    [AYTField.DIL]: [
      {key: 'Foreign Language', label: 'Yabancı Dil', maxQuestions: 80},
    ],
  };

  const aytFieldOptions = [
    {key: AYTField.SAYISAL, label: 'Sayısal', icon: 'functions'},
    {key: AYTField.ESIT_AGIRLIK, label: 'Eşit Ağırlık', icon: 'balance'},
    {key: AYTField.SOZEL, label: 'Sözel', icon: 'book'},
    {key: AYTField.DIL, label: 'Dil', icon: 'language'},
  ];

  const [results, setResults] = useState<{[key: string]: ExamResult}>({});

  const currentSubjects = examType === ExamType.TYT
    ? tytSubjects
    : (aytField ? aytSubjects[aytField] : []);

  React.useEffect(() => {
    const initialResults: {[key: string]: ExamResult} = {};
    currentSubjects.forEach(subject => {
      initialResults[subject.key] = {
        lesson: subject.key,
        correct: 0,
        wrong: 0,
        empty: subject.maxQuestions,
        net: 0,
      } as ExamResult;
    });
    setResults(initialResults);
  }, [examType, aytField]);

  const updateResult = (subjectKey: string, field: 'correct' | 'wrong', value: string) => {
    const numValue = parseInt(value) || 0;
    const subject = currentSubjects.find(s => s.key === subjectKey);
    if (!subject) return;

    setResults(prev => {
      const current = prev[subjectKey] || {lesson: subjectKey, correct: 0, wrong: 0, empty: subject.maxQuestions};
      const updated: ExamResult = {...current, [field]: numValue} as ExamResult;

      const total = updated.correct + updated.wrong;
      updated.empty = Math.max(0, subject.maxQuestions - total);

      if (total > subject.maxQuestions) {
        const excess = total - subject.maxQuestions;
        if (field === 'correct') {
          updated.correct = Math.max(0, updated.correct - excess);
        } else {
          updated.wrong = Math.max(0, updated.wrong - excess);
        }
        updated.empty = 0;
      }

      // net = doğru - yanlış/4
      updated.net = Number((updated.correct - updated.wrong / 4).toFixed(2));
      return {...prev, [subjectKey]: updated};
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!examName.trim()) {
      newErrors.examName = 'Sınav adı gereklidir';
    }

    if (examType === ExamType.AYT && !aytField) {
      newErrors.aytField = 'AYT alanı seçiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const resultsArray = Object.values(results);

    const examData = {
      name: examName.trim(),
      type: examType,
      results: resultsArray,
      ...(examType === ExamType.AYT && aytField && {aytField}),
    };

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(examData);
      } else {
        // Persist locally
        await examStore.addExam({
          name: examData.name,
          type: examData.type,
          results: resultsArray,
          userId: user?.id || 'local',
        } as any);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Hata', 'Sınav kaydedilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Sınav Sonucu Gir" showBack onBackPress={onCancel ? onCancel : undefined} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sınav Adı</Text>
              <TextInput
                style={[styles.input, errors.examName && styles.inputError]}
                placeholder="Örn: 3D Yayınları TYT-1"
                placeholderTextColor="#9CA3AF"
                value={examName}
                onChangeText={setExamName}
              />
              {errors.examName && <Text style={styles.errorText}>{errors.examName}</Text>}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Sınav Türü</Text>
              <View style={styles.examTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.examTypeButton,
                    examType === ExamType.TYT && styles.examTypeButtonActive,
                  ]}
                  onPress={() => {
                    setExamType(ExamType.TYT);
                    setAytField(undefined);
                  }}>
                  <Icon
                    name="school"
                    size={20}
                    color={examType === ExamType.TYT ? '#FFFFFF' : '#4285F4'}
                  />
                  <Text
                    style={[
                      styles.examTypeText,
                      examType === ExamType.TYT && styles.examTypeTextActive,
                    ]}>
                    TYT
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.examTypeButton,
                    examType === ExamType.AYT && styles.examTypeButtonActive,
                  ]}
                  onPress={() => setExamType(ExamType.AYT)}>
                  <Icon
                    name="trending-up"
                    size={20}
                    color={examType === ExamType.AYT ? '#FFFFFF' : '#4285F4'}
                  />
                  <Text
                    style={[
                      styles.examTypeText,
                      examType === ExamType.AYT && styles.examTypeTextActive,
                    ]}>
                    AYT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {examType === ExamType.AYT && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>AYT Alanı</Text>
                <View style={styles.aytFieldContainer}>
                  {aytFieldOptions.map((field) => (
                    <TouchableOpacity
                      key={field.key}
                      style={[
                        styles.aytFieldButton,
                        aytField === field.key && styles.aytFieldButtonActive,
                      ]}
                      onPress={() => setAytField(field.key)}>
                      <Icon
                        name={field.icon}
                        size={16}
                        color={aytField === field.key ? '#FFFFFF' : '#4285F4'}
                      />
                      <Text
                        style={[
                          styles.aytFieldText,
                          aytField === field.key && styles.aytFieldTextActive,
                        ]}>
                        {field.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.aytField && <Text style={styles.errorText}>{errors.aytField}</Text>}
              </View>
            )}

            {currentSubjects.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Soru Sayıları</Text>
                {currentSubjects.map((subject) => {
                  const result = results[subject.key] || {lesson: subject.key, correct: 0, wrong: 0, empty: subject.maxQuestions};
                  return (
                    <View key={subject.key} style={styles.subjectContainer}>
                      <Text style={styles.subjectTitle}>
                        {subject.label} (Toplam: {subject.maxQuestions})
                      </Text>
                      <View style={styles.inputRow}>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputGroupLabel}>Doğru</Text>
                          <TextInput
                            style={styles.numberInput}
                            value={result.correct.toString()}
                            onChangeText={(value) => updateResult(subject.key, 'correct', value)}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                        </View>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputGroupLabel}>Yanlış</Text>
                          <TextInput
                            style={styles.numberInput}
                            value={result.wrong.toString()}
                            onChangeText={(value) => updateResult(subject.key, 'wrong', value)}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                        </View>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputGroupLabel}>Boş</Text>
                          <Text style={styles.emptyCount}>{result.empty}</Text>
                        </View>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputGroupLabel}>Net</Text>
                          <Text style={styles.netCount}>
                            {(result.correct - result.wrong / 4).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading || currentSubjects.length === 0}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Sınavı Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: '#1A1A1A',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  examTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  examTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  examTypeButtonActive: {
    backgroundColor: '#4285F4',
  },
  examTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
  },
  examTypeTextActive: {
    color: '#FFFFFF',
  },
  aytFieldContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  aytFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  aytFieldButtonActive: {
    backgroundColor: '#4285F4',
  },
  aytFieldText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4285F4',
  },
  aytFieldTextActive: {
    color: '#FFFFFF',
  },
  subjectContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputGroupLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  numberInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    height: 40,
    minWidth: 50,
  },
  emptyCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    paddingVertical: 12,
  },
  netCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
    textAlign: 'center',
    paddingVertical: 12,
  },
  submitButton: {
    backgroundColor: '#4285F4',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ExamInputScreen;
