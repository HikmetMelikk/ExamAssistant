import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import DashboardScreen from './src/components/DashboardScreen';
import ExamInputScreen from './src/components/ExamInputScreen';
import Icon from './src/components/Icons';
import LoginScreen from './src/components/LoginScreen';
import OnboardingScreen from './src/components/OnboardingScreen';
import PomodoroScreen from './src/components/PomodoroScreen';
import RegisterScreen from './src/components/RegisterScreen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

type RootStackParamList = {
  Dashboard: undefined;
  ExamInput: undefined;
  Pomodoro: undefined;
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ExamInput" component={ExamInputScreen} /> 
    </Stack.Navigator>
  );
}

function AppContent() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const {user, isLoading} = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
        if (onboardingCompleted) {
          setHasSeenOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    })();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setHasSeenOnboarding(true);
    }
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <NavigationContainer>
      {!hasSeenOnboarding ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Onboarding">
            {() => <OnboardingScreen onComplete={handleOnboardingComplete} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : user ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4285F4',
            tabBarStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Tab.Screen 
            name="Ana Sayfa" 
            component={HomeStackNavigator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size || 22} />
              ),
            }}
          />
          <Tab.Screen 
            name="Pomodoro" 
            component={PomodoroScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="timer" color={color} size={size || 22} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login">
            {({navigation}) => (
              <LoginScreen onSwitchToRegister={() => navigation.navigate('Register')} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {({navigation}) => (
              <RegisterScreen onSwitchToLogin={() => navigation.navigate('Login')} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <View style={styles.container}>
        <AppContent />
      </View>
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
