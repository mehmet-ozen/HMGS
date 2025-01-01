import { View, Text, StyleSheet, Button, TouchableHighlight, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image, Platform, UIManager, LayoutAnimation } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut, LinearTransition, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';



export default function HomeScreen() {
  const navigation = useNavigation();
  
  useEffect(() => {
    // Bu efektin doğru çalıştığından emin olun
    console.log("Screen loaded");
  }, []);

  const DailyQuestion = () => {
    return (
      <View style={styles.DailyQuestionStyle}>
        <Text style={styles.DQTextStyle}>Sözleşmenin ahlaka aykırı olması kesin hükümsüzlük hallerindendir.</Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableHighlight style={styles.DQGButtonStyle}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#F5F5DC", textAlign: 'center' }}>DOĞRU</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.DQRButtonStyle}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#F5F5DC", textAlign: 'center' }}>YANLIŞ</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }



  //<Catagories setFilteredCourses={setFilteredCourses} coursesData={coursesData} />
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <TouchableOpacity onPress={() => navigation.navigate("Courses")}>
        <Text>Courses</Text>
      </TouchableOpacity>
    </View>
  )
}



const styles = StyleSheet.create({
  DailyQuestionStyle: {
    marginTop: 25,
    marginHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.background.card,
    paddingVertical: 20,

  },
  DQTextStyle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: 10,
  },
  DQGButtonStyle: {
    width: 120,
    height: 40,
    backgroundColor: colors.status.success,
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 20,

  },
  DQRButtonStyle: {
    width: 120,
    height: 40,
    backgroundColor: colors.status.error,
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 20,

  },
  CatagoriesItemStyle: {
    width: 120,
    height: 45,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  CatagoriesText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 12,
    textAlign:'center',

  },
  CoursesItemStyle: {
    width: 360,
    height: 100,
    borderRadius: 25,
    backgroundColor: colors.background.primary,
    borderColor: colors.background.secondary,
    flexDirection: "row",
    alignItems: 'center',
    position: 'relative',
    elevation: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginHorizontal: 10,
  },
  CoursesImage: {
    width: 80,
    height: 80,
    marginLeft: 12,
    borderRadius: 20,
  },
  IconContainer: {
    position: "absolute",
    alignSelf:"center",
    justifyContent: "center",
    right: 10,
    backgroundColor: colors.background.primary,
  },
});