import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from './Icons';
import {useAuth} from '../contexts/AuthContext';
import { AYTField, ExamType } from '../types';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({onSwitchToLogin}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const {register} = useAuth();
  const [selectedField, setSelectedField] = useState<AYTField | undefined>(undefined);

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4); // 0-4
  };
  const strength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ad Soyad gereklidir';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Ad Soyad en az 2 karakter olmalıdır';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    if (!selectedField) {
      newErrors.aytField = 'Alan seçimi zorunludur';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        // Her öğrenci TYT'ye girer; alan seçimi AYT içindir
        examType: ExamType.AYT,
        aytField: selectedField,
      };

      await register(registerData);
      // AuthContext otomatik olarak kullanıcıyı yönlendirecek
    } catch (error: any) {
      console.error('Register error:', error);
      Alert.alert(
        'Kayıt Hatası',
        error.message || 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({...prev, [key]: value}));
    if (errors[key]) {
      setErrors(prev => ({...prev, [key]: undefined}));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="school" size={32} color="#4285F4" />
            </View>
            <Text style={styles.title}>Hesap Oluşturun</Text>
            <Text style={styles.subtitle}>Sınav yolculuğunuza başlayın</Text>
          </View>

          <View style={styles.form}>
            {/* Ad Soyad */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon
                  name="person"
                  size={20}
                  color={errors.name ? '#EF4444' : '#9CA3AF'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Ad Soyad"
                  placeholderTextColor="#9CA3AF"
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* E-posta */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon
                  name="email"
                  size={20}
                  color={errors.email ? '#EF4444' : '#9CA3AF'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="E-posta adresi"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Şifre */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon
                  name="lock"
                  size={20}
                  color={errors.password ? '#EF4444' : '#9CA3AF'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                  placeholder="Şifre"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              {/* Güç göstergesi */}
              <View style={styles.strengthContainer}>
                <View style={[styles.strengthBar, strength >= 1 ? styles.strengthWeak : styles.strengthInactive]} />
                <View style={[styles.strengthBar, strength >= 2 ? styles.strengthFair : styles.strengthInactive]} />
                <View style={[styles.strengthBar, strength >= 3 ? styles.strengthGood : styles.strengthInactive]} />
                <View style={[styles.strengthBar, strength >= 4 ? styles.strengthStrong : styles.strengthInactive]} />
                <Text style={styles.strengthLabel}>
                  {strength <= 1 ? 'Zayıf' : strength === 2 ? 'Orta' : strength === 3 ? 'İyi' : 'Güçlü'}
                </Text>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Şifre Tekrarı */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon
                  name="lock"
                  size={20}
                  color={errors.confirmPassword ? '#EF4444' : '#9CA3AF'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
                  placeholder="Şifre Tekrarı"
                  placeholderTextColor="#9CA3AF"
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={isConfirmPasswordVisible ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* AYT Alanı Seçimi */}
            <View style={styles.inputContainer}>
              <Text style={styles.sectionLabel}>Alan Seçimi</Text>
              <View style={styles.fieldChips}>
                {[
                  { key: AYTField.SAYISAL, label: 'Sayısal', icon: 'functions' },
                  { key: AYTField.ESIT_AGIRLIK, label: 'Eşit Ağırlık', icon: 'balance' },
                  { key: AYTField.SOZEL, label: 'Sözel', icon: 'book' },
                  { key: AYTField.DIL, label: 'Dil', icon: 'language' },
                ].map(opt => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.fieldChip,
                      selectedField === opt.key && styles.fieldChipActive,
                    ]}
                    onPress={() => setSelectedField(opt.key)}
                  >
                    <Icon
                      name={opt.icon}
                      size={16}
                      color={selectedField === opt.key ? '#FFFFFF' : '#4285F4'}
                    />
                    <Text style={[
                      styles.fieldChipText,
                      selectedField === opt.key && styles.fieldChipTextActive,
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.aytField && <Text style={styles.errorText}>{errors.aytField}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.loginText}>Giriş Yapın</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  passwordInput: {
    paddingRight: 40,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginLeft: 4,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  strengthInactive: {
    backgroundColor: '#E5E7EB',
  },
  strengthWeak: { backgroundColor: '#EF4444' },
  strengthFair: { backgroundColor: '#F59E0B' },
  strengthGood: { backgroundColor: '#10B981' },
  strengthStrong: { backgroundColor: '#3B82F6' },
  strengthLabel: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
    marginLeft: 4,
  },
  fieldChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fieldChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  fieldChipActive: {
    backgroundColor: '#4285F4',
  },
  fieldChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4285F4',
  },
  fieldChipTextActive: {
    color: '#FFFFFF',
  },
  registerButton: {
    backgroundColor: '#4285F4',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4285F4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  loginText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '600',
  },
});

export default RegisterScreen;
