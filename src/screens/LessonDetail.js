import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolate,
  useSharedValue
} from 'react-native-reanimated';
import { colors } from '../theme/colors';



export default function LessonDetail({ route }) {

  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },

}); 