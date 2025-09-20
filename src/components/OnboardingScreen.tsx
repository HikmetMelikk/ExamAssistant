import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface Slide {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

const slides: Slide[] = [
  {
    id: 1,
    icon: 'book',
    title: 'Sınavlarını Takip Et',
    subtitle:
      'Deneme sınav sonuçlarını kaydet ve performansını takip et. Gelişim alanlarını belirle.',
    color: '#4285F4',
  },
  {
    id: 2,
    icon: 'trending-up',
    title: 'Performansını Analiz Et',
    subtitle:
      'Detaylı analizlerle güçlü ve zayıf yanlarını keşfet. Hangi derslerde daha çok çalışman gerektiğini öğren.',
    color: '#34A853',
  },
  {
    id: 3,
    icon: 'emoji-events',
    title: 'Hedeflerine Ulaş',
    subtitle:
      'Hedeflerini belirle ve motivasyonunu yüksek tut. Üniversite yolculuğunda başarıya ulaş.',
    color: '#9C27B0',
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({onComplete}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4285F4" />
      
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon name="school" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.logoText}>Sınav Asistanı</Text>
        <Text style={styles.tagline}>Çalışma arkadaşın</Text>
      </View>

      <View style={styles.slideContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentSlide(index);
          }}>
          {slides.map((slide, index) => (
            <View key={slide.id} style={[styles.slide, {width}]}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: `${slide.color}20`},
                ]}>
                <Icon name={slide.icon} size={48} color={slide.color} />
              </View>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              {backgroundColor: index === currentSlide ? '#FFFFFF' : '#FFFFFF60'},
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={prevSlide}
          style={[
            styles.backButton,
            {opacity: currentSlide === 0 ? 0 : 1},
          ]}
          disabled={currentSlide === 0}>
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={nextSlide} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Başla' : 'Devam'}
          </Text>
          <Icon name="chevron-right" size={20} color="#4285F4" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4285F4',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#FFFFFF80',
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
    marginRight: 8,
  },
});

export default OnboardingScreen;