import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

export default function HomeScreen() {
  const navigation = useNavigation();
  const userName = "Mehmet"; // Kullanıcı adını buradan değiştirebilirsiniz

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} style="auto"/>
      <View style={styles.container}>
        <View style={styles.topSection}>
        <View style={styles.topBackground}/>
          <Image
            source={require('../../assets/images/pp_8.png')}
            style={styles.circleImage}
          />
        <Animated.View 
            entering={FadeInDown.delay(400)} 
            style={styles.welcomeContainer}
        >
          <Text 
            style={styles.nameText}
          >
            {userName}
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
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Courses')}
          >
            <View style={styles.buttonContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="book-outline" size={24} color={colors.text.white} />
              </View>
              <Text style={styles.buttonText}>DERSLER</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={() => {}}
          >
            <View style={styles.buttonContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="help-circle-outline" size={24} color={colors.text.white} />
              </View>
              <Text style={styles.buttonText}>SORU BANKASI</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
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
    textAlign:'center'
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
    gap: 20,
  },
  button: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
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
    paddingHorizontal: 30,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
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
});