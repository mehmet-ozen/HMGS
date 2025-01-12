import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { StyleSheet} from 'react-native';
import { createStaticNavigation, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './src/theme/colors';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import QuizCompetitionScreen from './src/screens/Competition/QuizCompetitionScreen.js';
import WheelScreen from './src/screens/Competition/WheelScreen.js';
import CoursesScreen from './src/screens/Courses/CoursesScreen.js';
import CoursesDetailScreen from './src/screens/Courses/CoursesDetailScreen.js';
import QuizTopicsScreen from './src/screens/Courses/QuizTopicsScreen.js';
import QuizScreen from './src/screens/Courses/QuizScreen.js';
import NotesScreen from './src/screens/Courses/NotesScreen.js';
import BottomFormSheet from './src/screens/Courses/BottomFormSheet.js';
import SettingsScreen from './src/screens/SettingsScreen.js';



const RootStack = createNativeStackNavigator({

  screenOptions: {
    title: 'Hukuk&HMGS',
    headerTitleStyle: { color: colors.primary },
    headerStyle: { backgroundColor: colors.primary },
    safeAreaInsets: { top: 0,bottom:0,left:0,right:0 },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Hukuk',
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.text.primary },
        headerStyle: { backgroundColor: colors.primary },
        headerShown: false,
      },
    },
    QuizCompetition: {
      screen: QuizCompetitionScreen,
      options: {
        headerStyle: { backgroundColor: colors.primary },
        animation: 'slide_from_bottom',
        headerTitle: '',
        headerBackVisible: false,
        headerTintColor: colors.text.white,

      }
    },
    Settings: {
      screen: SettingsScreen,
      options: {
        headerStyle: { backgroundColor: colors.primary },
        animation: 'slide_from_bottom',
        headerTitle: 'Ayarlar',
        headerTintColor: colors.text.white,
        headerTitleStyle: { color: colors.text.white },

      }
    },
    WheelScreen: {
      screen: WheelScreen,
      options: {
      }
    },
    Courses: {
      screen: CoursesScreen,
      
      options: {
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        animation: 'slide_from_bottom',
        headerTitle: 'Dersler',
        headerTitleStyle: { color: colors.text.white },
        headerTintColor: colors.text.white,
        safeAreaInsets: { top: 0 },
      }
    },
    BottomFormSheet: {
      screen: BottomFormSheet,
      options: {
        presentation: 'formSheet',
        sheetAllowedDetents:[0.4,0.4],
        sheetCornerRadius:20,
      }
    },
    CoursesDetail: {
      screen: CoursesDetailScreen,
      options: {
        headerShown: true,
        headerTitleStyle: { color: colors.text.white },
        headerTintColor: colors.text.white,
        safeAreaInsets: { top: 0 },
        
      },
    },
    QuizTopics: {
      screen: QuizTopicsScreen,
      options: {
        headerTitleStyle: { color: colors.text.white },
        headerTintColor: colors.text.white,
      },
    },
    Quiz: {
      screen: QuizScreen,
      options: {
        headerShown: true,
        headerTitle: 'Test',
        headerTitleStyle: { color: colors.text.white },
        headerTintColor: colors.text.white,
        safeAreaInsets: { top: 0, },
      },
    },
    Notes: {
      screen: NotesScreen,
      options: ({ navigation }) => ({
        headerTitleStyle: { color: colors.text.white },
        headerTintColor: colors.text.white,
        safeAreaInsets: { top: 0 },
        animation: 'slide_from_bottom',
      }),
    },
  },
});
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000',
  },
};
const Navigation = createStaticNavigation(RootStack);
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar backgroundColor={colors.primary} style="light" />
        <Navigation theme={MyTheme} />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({

});
