import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from './Icons';
import {useAuth} from '../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { examStore } from '../services/examStore';
import { Exam } from '../types';
import Header from './Header';

const DashboardScreen: React.FC = () => {
  const {user, logout} = useAuth();
  const navigation = useNavigation<any>();
  const [exams, setExams] = useState<Exam[]>([]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        const data = await examStore.getExams();
        if (mounted) setExams(data);
      })();
      return () => { mounted = false; };
    }, [])
  );

  const stats = useMemo(() => {
    const total = exams.length;
    const avg = total > 0 ? (exams.reduce((s, e) => s + (e.totalNet || 0), 0) / total) : 0;
    return { totalExams: total, avgNet: Number(avg.toFixed(2)), pomodoro: 0 };
  }, [exams]);

  const handleLogout = () => {
    logout();
  };

  // ExamInput ve Pomodoro artık stack ekranları üzerinden açılacak

  return (
    <View style={styles.container}>
      <Header 
        title={`Hoş geldin, ${user?.name?.split(' ')[0] || 'Öğrenci'}!`} 
        rightIcon="logout" 
        onRightPress={handleLogout} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.statsOverview}>
          <Text style={styles.statsTitle}>
            {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} • {new Date().toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long'
            })}
          </Text>
          <Text style={styles.statsSubtitle}>Bugün hangi hedefini gerçekleştiriyorsun? 🎯</Text>

          <View style={styles.statsCards}>
            <View style={styles.statCard}>
              <Icon name="emoji-events" size={24} color="#FFD700" />
              <Text style={styles.statCardValue}>{stats.totalExams}</Text>
              <Text style={styles.statCardLabel}>Toplam Sınav</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.statCardValue}>{stats.avgNet}</Text>
              <Text style={styles.statCardLabel}>Ortalama Net</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="timer" size={24} color="#9C27B0" />
              <Text style={styles.statCardValue}>{stats.pomodoro}</Text>
              <Text style={styles.statCardLabel}>Pomodoro</Text>
            </View>
          </View>
        </View>

        {/* Çalışma Araçları buraya taşındı */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Çalışma Araçları</Text>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, {backgroundColor: '#4285F4'}]}
              onPress={() => navigation.navigate('ExamInput')}>
              <Icon name="add" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Yeni Sınav</Text>
              <Text style={styles.actionSubtext}>Sonuç Ekle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, {backgroundColor: '#34A853'}]}>
              <Icon name="trending-up" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Analiz</Text>
              <Text style={styles.actionSubtext}>Performans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, {backgroundColor: '#9C27B0'}]}
              onPress={() => navigation.navigate('Pomodoro')}>
              <Icon name="timer" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Pomodoro</Text>
              <Text style={styles.actionSubtext}>Çalışma</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, {backgroundColor: '#FF9800'}]}>
              <Icon name="flag" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Hedefler</Text>
              <Text style={styles.actionSubtext}>Belirle</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dailyMotivation}>
          <View style={styles.motivationHeader}>
            <Icon name="heart" size={20} color="#FFFFFF" />
            <Text style={styles.motivationTitle}>Günlük Motivasyon</Text>
            <TouchableOpacity style={styles.shareButton}>
              <Icon name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.motivationSubtitle}>Hedefe doğru ilerlemeye devam et!</Text>
          <Text style={styles.motivationQuote}>
            "Başarı son nokta değil, başarısızlık ölümcül değil: Önemli olan devam etme cesareti."
          </Text>
          <View style={styles.motivationFooter}>
            <View style={styles.quoteAuthor}>
              <Icon name="star" size={14} color="#FFFFFF" />
              <Text style={styles.authorText}>Günün Sözü</Text>
            </View>
            <TouchableOpacity style={styles.shareTextButton}>
              <Text style={styles.shareText}>Paylaş</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Geçmiş Sınavlar buraya taşındı ve dinamik hale getirildi */}
        <View style={styles.recentExamsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Geçmiş Sınavlar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentExamsList}>
            {exams.length === 0 ? (
              <Text style={{color: '#666666'}}>Henüz sınav eklenmedi.</Text>
            ) : (
              exams.map(exam => (
                <View key={exam.id} style={styles.recentExamItem}>
                  <View style={styles.examItemLeft}>
                    <Text style={styles.examItemName}>{exam.name}</Text>
                    <View style={styles.examItemMeta}>
                      <Text style={styles.examItemDate}>{new Date(exam.createdAt).toLocaleString('tr-TR')}</Text>
                      <View style={styles.examStatusBadge}>
                        <Text style={styles.examStatusText}>Tamamlandı</Text>
                      </View>
                    </View>
                    <View style={styles.examItemStats}>
                      <View style={styles.examStatItem}>
                        <Icon name="check" size={12} color="#4CAF50" />
                        <Text style={styles.examStatText}>{exam.results.reduce((s, r) => s + r.correct, 0)}</Text>
                      </View>
                      <View style={styles.examStatItem}>
                        <Icon name="close" size={12} color="#F44336" />
                        <Text style={styles.examStatText}>Wrong: {exam.results.reduce((s, r) => s + r.wrong, 0)}</Text>
                      </View>
                      <View style={styles.examStatItem}>
                        <Icon name="remove" size={12} color="#9E9E9E" />
                        <Text style={styles.examStatText}>Empty: {exam.results.reduce((s, r) => s + r.empty, 0)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.examItemRight}>
                    <Text style={styles.examNetScore}>{Number(exam.totalNet || 0).toFixed(2)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.subjectPerformance}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ders Performansı</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subjectsList}>
            <View style={styles.subjectItem}>
              <View style={styles.subjectInfo}>
                <View style={[styles.subjectIcon, {backgroundColor: '#4285F420'}]}>
                  <Icon name="book" size={20} color="#4285F4" />
                </View>
                <View style={styles.subjectDetails}>
                  <Text style={styles.subjectName}>Türkçe</Text>
                  <Text style={styles.subjectQuestions}>40 soruluk</Text>
                </View>
              </View>
              <View style={styles.subjectScore}>
                <Text style={styles.scoreValue}>32.5</Text>
                <Text style={styles.scoreChange}>+4.5</Text>
              </View>
            </View>

            <View style={styles.subjectProgress}>
              <View style={[styles.progressBar, {backgroundColor: '#4285F420'}]}>
                <View style={[styles.progressFill, {backgroundColor: '#4285F4', width: '81%'}]} />
              </View>
              <Text style={styles.progressText}>81%</Text>
              <Text style={styles.progressTarget}>40</Text>
            </View>

            <View style={styles.subjectItem}>
              <View style={styles.subjectInfo}>
                <View style={[styles.subjectIcon, {backgroundColor: '#FF980020'}]}>
                  <Icon name="functions" size={20} color="#FF9800" />
                </View>
                <View style={styles.subjectDetails}>
                  <Text style={styles.subjectName}>Matematik</Text>
                  <Text style={styles.subjectQuestions}>40 soruluk</Text>
                </View>
              </View>
              <View style={styles.subjectScore}>
                <Text style={styles.scoreValue}>28.75</Text>
                <Text style={styles.scoreChange}>-1.25</Text>
              </View>
            </View>

            <View style={styles.subjectProgress}>
              <View style={[styles.progressBar, {backgroundColor: '#FF980020'}]}>
                <View style={[styles.progressFill, {backgroundColor: '#FF9800', width: '72%'}]} />
              </View>
              <Text style={styles.progressText}>72%</Text>
              <Text style={styles.progressTarget}>40</Text>
            </View>

            <View style={styles.subjectItem}>
              <View style={styles.subjectInfo}>
                <View style={[styles.subjectIcon, {backgroundColor: '#4CAF5020'}]}>
                  <Icon name="science" size={20} color="#4CAF50" />
                </View>
                <View style={styles.subjectDetails}>
                  <Text style={styles.subjectName}>Fen Bilimleri</Text>
                  <Text style={styles.subjectQuestions}>20 soruluk</Text>
                </View>
              </View>
              <View style={styles.subjectScore}>
                <Text style={styles.scoreValue}>16.5</Text>
                <Text style={styles.scoreChange}>+3.0</Text>
              </View>
            </View>

            <View style={styles.subjectProgress}>
              <View style={[styles.progressBar, {backgroundColor: '#4CAF5020'}]}>
                <View style={[styles.progressFill, {backgroundColor: '#4CAF50', width: '83%'}]} />
              </View>
              <Text style={styles.progressText}>83%</Text>
              <Text style={styles.progressTarget}>20</Text>
            </View>
          </View>
        </View>

        {/* QuickActions moved above; removing duplicate below */}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#666666" />
              <Text style={styles.infoLabel}>E-posta</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="school" size={20} color="#666666" />
              <Text style={styles.infoLabel}>Sınav Türü</Text>
              <Text style={styles.infoValue}>{user?.examType}</Text>
            </View>
            
            {user?.aytField && (
              <View style={styles.infoRow}>
                <Icon name="category" size={20} color="#666666" />
                <Text style={styles.infoLabel}>Alan</Text>
                <Text style={styles.infoValue}>{user.aytField}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Icon name="calendar-today" size={20} color="#666666" />
              <Text style={styles.infoLabel}>Katılım Tarihi</Text>
              <Text style={styles.infoValue}>
                {new Date(user?.createdAt || '').toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.comingSoon}>
          <View style={styles.comingSoonIcon}>
            <Icon name="construction" size={32} color="#FF9800" />
          </View>
          <Text style={styles.comingSoonTitle}>Çok Yakında</Text>
          <Text style={styles.comingSoonText}>
            Sınav sonuçları ekleme, detaylı analizler, pomodoro timer ve daha birçok özellik yakında sizlerle!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  dailyMotivation: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#9C27B0',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 6,
  },
  motivationSubtitle: {
    fontSize: 14,
    color: '#FFFFFF90',
    marginBottom: 12,
  },
  motivationQuote: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  motivationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorText: {
    fontSize: 12,
    color: '#FFFFFF80',
    fontWeight: '500',
  },
  shareTextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shareText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  subjectPerformance: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectsList: {
    gap: 16,
  },
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subjectDetails: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  subjectQuestions: {
    fontSize: 12,
    color: '#666666',
  },
  subjectScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  scoreChange: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
  subjectProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    minWidth: 32,
  },
  progressTarget: {
    fontSize: 12,
    color: '#9E9E9E',
    minWidth: 20,
  },
  recentExamsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentExamsList: {
    gap: 16,
  },
  recentExamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  examItemLeft: {
    flex: 1,
    marginRight: 16,
  },
  examItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  examItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  examItemDate: {
    fontSize: 12,
    color: '#666666',
  },
  examStatusBadge: {
    backgroundColor: '#4CAF5020',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  examStatusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4CAF50',
  },
  examItemStats: {
    flexDirection: 'row',
    gap: 12,
  },
  examStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  examStatText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
  },
  examItemRight: {
    alignItems: 'flex-end',
  },
  examNetScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  recentExams: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },
  examsList: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  examBadge: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  examBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  examDate: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  examName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    lineHeight: 22,
  },
  examStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  examStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  examStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  examStatLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  addExamCard: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    marginRight: 12,
    width: 200,
  },
  addExamButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
  },
  addExamText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 12,
    color: '#FFFFFF80',
  },
  infoSection: {
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  comingSoon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comingSoonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DashboardScreen;
