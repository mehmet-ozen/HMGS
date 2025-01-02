import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/pp_1.png')}
          style={styles.circleImage}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('Courses')}
        >
          <Text style={styles.buttonText}>DERSLER</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#8B4513' }]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>SORU BANKASI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 50,
  },
  circleImage: {
    width: width * 0.5, // Ekran genişliğinin yarısı
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: '#ddd', // Placeholder renk
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
    elevation: 5, // Android gölge
    shadowColor: '#000', // iOS gölge
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
  },
});