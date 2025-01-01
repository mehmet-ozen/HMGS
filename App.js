import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { StyleSheet, Text, View } from 'react-native';
import { createStaticNavigation, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LessonDetail from './src/screens/LessonDetail';
import WhiteboardScreen from './src/screens/WhiteBoardScreen.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './src/theme/colors';
import CoursesDetailScreen from './src/screens/CoursesDetailScreen.js';
import CoursesScreen from './src/screens/CoursesScreen.js';
import { createStackNavigator } from '@react-navigation/stack';
const RootStack = createNativeStackNavigator({
  
  screenOptions: {
    title: 'Hukuk&HMGS',
    headerTitleStyle: { color: colors.text.white },
    headerStyle: { backgroundColor: colors.primary },
  },
  screens: {
    Home: {
      screen: HomeScreen,
    
      options: {
        title: 'Hukuk',
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.text.white },
        headerStyle: { backgroundColor: colors.primary },
        // headerLeft: () => {
        //   return (
        //     <View style={{ 
        //       backgroundColor: colors.background.primary, 
        //       width: 50, 
        //       height: 40, 
        //       borderRadius: 20, 
        //       justifyContent: 'center', 
        //       marginRight: 10 
        //     }}>
        //       <MaterialCommunityIcons 
        //         name="gavel" 
        //         size={24} 
        //         color={colors.primary} 
        //         style={{ textAlign: 'center' }} 
        //       />
        //     </View>
        //   );
        // }
      },
    },
    Courses: {
      screen: CoursesScreen,
      options: {
        headerStyle: { backgroundColor: colors.background.primary },
        animation: 'slide_from_bottom',
        presentation: 'modal',

      }
    },
    CoursesDetail: {
      screen: CoursesDetailScreen,
      options: {
      }
    },
    LessonDetail: {
      screen: LessonDetail,
      options: ({ route }) => ({
        headerTitleStyle: { color: colors.text.white },
        headerStyle: { backgroundColor: colors.primary },
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
