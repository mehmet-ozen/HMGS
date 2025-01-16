import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, useSharedValue } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import images from '../data/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

const DailyQuestionCard = () => (
  <TouchableOpacity style={styles.dailyQuestionCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>Günün Sorusu</Text>
      <View style={styles.timerContainer}>
        <Ionicons name="time-outline" size={16} color={colors.text.light} />
        <Text style={styles.timerText}>23:45:12</Text>
      </View>
    </View>
    <View style={styles.questionContainer}>
      <Text style={styles.questionText} numberOfLines={2}>
        Borçlar hukukunda sebepsiz zenginleşmenin şartları nelerdir?
      </Text>
      <Ionicons
        name="expand-outline"
        size={20}
        color={colors.primary}
        style={styles.expandIcon}
      />
    </View>
  </TouchableOpacity>
);

const HomeButton = ({ onPress, title, icon, color, style }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }, style]}
    onPress={onPress}
  >
    <View style={styles.buttonContent}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={colors.text.white} />
      </View>
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      <StatusBar backgroundColor={colors.primary} style="auto" />
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.topBackground} />
          <Image
            source={images.avatars[user.profilePhotoIndex]}
            style={styles.circleImage}
          />
          <Animated.View
            entering={FadeInDown.delay(400)}
            style={styles.welcomeContainer}
          >
            <Text
              style={styles.nameText}
            >
              {user.fullName}
            </Text>
            <Text style={styles.sloganText}>Adalet ve Başarı Yolunda</Text>
          </Animated.View>

          <DailyQuestionCard />
        </View>

        {/* <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons 
              name="book" 
              size={24} 
              color={colors.primary} 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Çalışılan{'\n'}Kanun</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons 
              name="document-text" 
              size={24} 
              color={colors.primary} 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Çözülen{'\n'}İçtihat</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons 
              name="trophy" 
              size={24} 
              color={colors.primary} 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Başarı{'\n'}Oranı</Text>
          </View>
        </View> */}

        <View style={styles.buttonContainer}>
          <HomeButton
            title="DERSLER"
            icon="book-outline"
            color={colors.primary}
            onPress={() => navigation.navigate('Courses')}
          />

          <HomeButton
            title="HUKUK ÇARKI"
            icon="flower-outline"
            color={colors.secondary}
            onPress={() => navigation.navigate('WheelScreen')}
          />
          <HomeButton
            title="LİDERLİK TABLOSU"
            icon="trophy-outline"
            color={colors.tertiary}
            onPress={() => navigation.navigate('LeaderBoard')}
          />
          <HomeButton
            title="AYARLAR"
            icon="settings-outline"
            color={colors.quaternary}
            onPress={() => navigation.navigate('Settings')}
          />

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topBackground: {
    height: 420, // Yüksekliği artırdık
    backgroundColor: colors.primary,
    position: 'absolute',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    top: 0,
    left: 0,
    right: 0
  },
  welcomeContainer: {
    paddingHorizontal: 30,
    marginTop: 5,
  },

  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center'
  },
  topSection: {
    alignItems: 'center',
    height: 420,
  },
  circleImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: colors.background.primary,
    borderWidth: 4,
    borderColor: colors.background.primary,
    marginTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 40,
    gap: 15,
  },
  button: {
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  dailyQuestionCard: {
    marginHorizontal: 20,
    marginTop: 20,
    width: '80%',
    padding: 15,
    backgroundColor: colors.background.card,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timerText: {
    fontSize: 14,
    color: colors.text.light,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 20,
    flex: 1,
    marginRight: 10,
  },
  expandIcon: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.background.card,
    borderRadius: 15,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    width: width * 0.25,
  },
  statIcon: {
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.light,
    marginTop: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sloganText: {
    fontSize: 16,
    color: colors.text.white,
    fontStyle: 'italic',
    marginTop: 10,
    opacity: 0.9,
    textAlign: 'center',
  },
  smallButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  smallButton: {
    flex: 1,
    height: 50,
  },
});