import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, useSharedValue } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import images from '../data/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../components/Avatar';


const { width, height } = Dimensions.get('window');

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

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  console.log(user)

  // Kullanıcı verisi yüklenene kadar loading göster
  if (!user || !user.avatar) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      <StatusBar backgroundColor={'black'} style="auto" />
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Avatar 
          user={user}
          size='large'
          style={{marginTop:20}}
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
            onPress={() => navigation.navigate('Matchups')}
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
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  circleImage: {
    width: height <= 720? width * 0.3: width * 0.4,
    height: height <= 720? width * 0.3: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: colors.background.primary,
    borderWidth: 4,
    borderColor: colors.background.primary,
    marginTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    flex:1,
    justifyContent:"space-evenly"
  },
  button: {
    height: '20%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  dailyQuestionCard: {
    marginHorizontal: 20,
    marginVertical: 20,
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
  sloganText: {
    fontSize: 16,
    color: colors.text.white,
    fontStyle: 'italic',
    marginTop: 10,
    opacity: 0.9,
    textAlign: 'center',
  },
});