import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import OnboardingScreen from './src/components/OnboardingScreen';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import DashboardScreen from './src/components/DashboardScreen';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Screen = 'onboarding' | 'login' | 'register' | 'dashboard';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const {user, isLoading} = useAuth();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      if (onboardingCompleted) {
        setHasSeenOnboarding(true);
        setCurrentScreen('login');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      setHasSeenOnboarding(true);
      setCurrentScreen('login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setCurrentScreen('login');
    }
  };

  if (isLoading) {
    return <SafeAreaView style={styles.container} />;
  }

  // Kullanıcı giriş yapmışsa dashboard'a yönlendir
  if (user) {
    return <DashboardScreen />;
  }

  // Onboarding tamamlanmışsa ve kullanıcı yoksa login/register ekranlarını göster
  if (hasSeenOnboarding) {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onSwitchToRegister={() => setCurrentScreen('register')}
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            onSwitchToLogin={() => setCurrentScreen('login')}
          />
        );
      default:
        return (
          <LoginScreen 
            onSwitchToRegister={() => setCurrentScreen('register')}
          />
        );
    }
  }

  // Onboarding göster
  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <SafeAreaView style={styles.container}>
        <AppContent />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

export default App;