import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { StyleSheet} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './src/theme/colors';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AuthProvider } from './src/context/AuthContext.js';
import Navigation from './src/navigations/navigation.js';
import Toast from 'react-native-toast-message';




export default function App() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar backgroundColor={colors.primary} style="light" />
        <Navigation />
        <Toast />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({

});
