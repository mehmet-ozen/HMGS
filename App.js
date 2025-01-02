import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { StyleSheet, Text, View } from 'react-native';
import { createStaticNavigation, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import WhiteboardScreen from './src/screens/WhiteBoardScreen.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './src/theme/colors';
import CoursesDetailScreen from './src/screens/CoursesDetailScreen.js';
import CoursesScreen from './src/screens/CoursesScreen.js';
import { createStackNavigator } from '@react-navigation/stack';
import NotesScreen from './src/screens/NotesScreen.js';
const RootStack = createNativeStackNavigator({
  
  screenOptions: {
    title: 'Hukuk&HMGS',
    headerTitleStyle: { color: colors.primary },
    headerStyle: { backgroundColor: colors.primary },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Hukuk',
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.text.primary },
        headerStyle: { backgroundColor: colors.primary },
      },
    },
    Courses: {
      screen: CoursesScreen,
      options: {
        headerStyle: { backgroundColor: colors.background.primary },
        animation: 'slide_from_bottom',
        presentation: 'modal',
        headerTitle: 'Dersler',
        headerTitleStyle: { color: colors.text.primary },
      }
    },
    CoursesDetail: {
      screen: CoursesDetailScreen,
      options: {
        headerStyle: { backgroundColor: colors.background.primary },
        headerTitleStyle: { color: colors.text.primary },
      }
    },
    Notes: {
      screen: NotesScreen,
      options: ({ route }) => ({
        headerTitleStyle: { color: colors.text.primary },
        headerStyle: { backgroundColor: colors.background.primary },
      }),
    },
    Whiteboard: {
      screen: WhiteboardScreen,
      options: {
        title: 'Whiteboard',
        headerTitleStyle: { color: colors.text.white },
        headerStyle: { backgroundColor: colors.primary },
      },
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
    <GestureHandlerRootView>
      <Navigation theme={MyTheme}/>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({

});
