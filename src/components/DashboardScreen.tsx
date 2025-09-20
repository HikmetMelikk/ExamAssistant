import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../contexts/AuthContext';

const DashboardScreen: React.FC = () => {
  const {user, logout} = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4285F4" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Icon name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.greeting}>Hoş geldiniz,</Text>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userType}>{user?.examType} Öğrencisi</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="logout" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Icon name="emoji-events" size={32} color="#4285F4" />
          </View>
          <Text style={styles.welcomeTitle}>Başarıyla Giriş Yaptınız!</Text>
          <Text style={styles.welcomeText}>
            Sınav asistanınıza hoş geldiniz. Performansınızı takip edin ve hedeflerinize ulaşın.
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, {backgroundColor: '#4285F4'}]}>
              <Icon name="add" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Yeni Sınav</Text>
              <Text style={styles.actionSubtext}>Sonuç Ekle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, {backgroundColor: '#34A853'}]}>
              <Icon name="trending-up" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Analiz</Text>
              <Text style={styles.actionSubtext}>Performans</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, {backgroundColor: '#9C27B0'}]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#4285F4',
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#FFFFFF80',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userType: {
    fontSize: 12,
    color: '#FFFFFF80',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: -12,
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
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActions: {
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