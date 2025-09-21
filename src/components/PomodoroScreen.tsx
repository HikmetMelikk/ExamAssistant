import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Animated, ScrollView } from 'react-native';
import Icon from './Icons';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';

interface PomodoroScreenProps {
  onBack?: () => void;
}

const {width} = Dimensions.get('window');

const PomodoroScreen: React.FC<PomodoroScreenProps> = ({onBack}) => {
  const navigation = useNavigation<any>();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break' | 'longBreak'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [progress] = useState(new Animated.Value(0));

  const sessionDurations = {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;

          // Update progress animation
          const totalTime = sessionDurations[sessionType];
          const progressValue = 1 - (newTime / totalTime);
          Animated.timing(progress, {
            toValue: progressValue,
            duration: 1000,
            useNativeDriver: false,
          }).start();

          if (newTime === 0) {
            handleSessionComplete();
          }

          return newTime;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft, sessionType]);

  const handleSessionComplete = () => {
    setIsActive(false);

    if (sessionType === 'work') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);

      // Every 4 work sessions, take a long break
      if (newCompleted % 4 === 0) {
        setSessionType('longBreak');
        setTimeLeft(sessionDurations.longBreak);
      } else {
        setSessionType('break');
        setTimeLeft(sessionDurations.break);
      }
    } else {
      setSessionType('work');
      setTimeLeft(sessionDurations.work);
    }

    progress.setValue(0);
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(sessionDurations[sessionType]);
    progress.setValue(0);
  };

  const handleSessionChange = (type: 'work' | 'break' | 'longBreak') => {
    if (!isActive) {
      setSessionType(type);
      setTimeLeft(sessionDurations[type]);
      progress.setValue(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work':
        return '#4285F4';
      case 'break':
        return '#4CAF50';
      case 'longBreak':
        return '#9C27B0';
      default:
        return '#4285F4';
    }
  };

  const getSessionTitle = () => {
    switch (sessionType) {
      case 'work':
        return 'Çalışma Zamanı';
      case 'break':
        return 'Kısa Mola';
      case 'longBreak':
        return 'Uzun Mola';
      default:
        return 'Çalışma Zamanı';
    }
  };

  const getSessionIcon = () => {
    switch (sessionType) {
      case 'work':
        return 'book';
      case 'break':
        return 'timer';
      case 'longBreak':
        return 'timer';
      default:
        return 'book';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Pomodoro" showBack onBackPress={onBack} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sessionInfo}>
          <Icon name={getSessionIcon()} size={32} color={getSessionColor()} />
          <Text style={[styles.sessionTitle, {color: getSessionColor()}]}>
            {getSessionTitle()}
          </Text>
          <Text style={styles.sessionDescription}>
            {sessionType === 'work'
              ? 'Odaklan ve verimli çalış!'
              : 'Dinlen ve enerji topla!'}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.circularProgress}>
            <Animated.View
              style={[
                styles.progressCircle,
                {
                  backgroundColor: getSessionColor(),
                  transform: [
                    {
                      rotate: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
            <View style={styles.timerInner}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>
                {sessionType === 'work' ? 'dakika kaldı' : 'mola'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          {!isActive || isPaused ? (
            <TouchableOpacity
              style={[styles.primaryButton, {backgroundColor: getSessionColor()}]}
              onPress={handleStart}>
              <Icon name="arrow-forward" size={24} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>
                {isPaused ? 'Devam Et' : 'Başla'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryButton, styles.pauseButton]}
              onPress={handlePause}>
              <Icon name="close" size={24} color="#666666" />
              <Text style={styles.pauseButtonText}>Duraklat</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
            <Icon name="arrow-back" size={20} color="#666666" />
            <Text style={styles.secondaryButtonText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sessionTabs}>
          <TouchableOpacity
            style={[
              styles.sessionTab,
              sessionType === 'work' && styles.activeTab,
              sessionType === 'work' && {backgroundColor: getSessionColor()},
            ]}
            onPress={() => handleSessionChange('work')}
            disabled={isActive}>
            <Text style={[
              styles.sessionTabText,
              sessionType === 'work' && styles.activeTabText,
            ]}>
              Çalışma
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sessionTab,
              sessionType === 'break' && styles.activeTab,
              sessionType === 'break' && {backgroundColor: getSessionColor()},
            ]}
            onPress={() => handleSessionChange('break')}
            disabled={isActive}>
            <Text style={[
              styles.sessionTabText,
              sessionType === 'break' && styles.activeTabText,
            ]}>
              Kısa Mola
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sessionTab,
              sessionType === 'longBreak' && styles.activeTab,
              sessionType === 'longBreak' && {backgroundColor: getSessionColor()},
            ]}
            onPress={() => handleSessionChange('longBreak')}
            disabled={isActive}>
            <Text style={[
              styles.sessionTabText,
              sessionType === 'longBreak' && styles.activeTabText,
            ]}>
              Uzun Mola
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedSessions}</Text>
            <Text style={styles.statLabel}>Tamamlanan Pomodoro</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.floor(completedSessions / 4)}</Text>
            <Text style={styles.statLabel}>Tamamlanan Döngü</Text>
          </View>
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
    paddingTop: 24,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  sessionInfo: {
    alignItems: 'center',
    marginBottom: 48,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  sessionDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  circularProgress: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.1,
  },
  timerInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    color: '#666666',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 48,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pauseButton: {
    backgroundColor: '#F0F0F0',
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  sessionTabs: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 4,
    marginBottom: 48,
  },
  sessionTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default PomodoroScreen;
