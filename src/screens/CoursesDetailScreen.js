import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  useSharedValue,
  LinearTransition
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const coursesData = [
  {
    id: 1,
    title: "Genel Bilgiler",
    subTopics: [
      { id: 'sub1', title: "Kişiler Hukuku" },
      { id: 'sub2', title: "Aile Hukuku" },
      { id: 'sub3', title: "Miras Hukuku" },
    ]
  },
  {
    id: 2,
    title: "Borcun Kaynakları",
    subTopics: [
      { id: 'sub4', title: "Genel Hükümler" },
      { id: 'sub5', title: "Özel Borç İlişkileri" },
    ]
  },
  {
    id: 3,
    title: "İfa",
    subTopics: [
      { id: 'sub4', title: "Genel Hükümler" },
      { id: 'sub5', title: "Özel Borç İlişkileri" },
    ]
  },
  {
    id: 4,
    title: "Borçların İfa Edilmemesinin Sonuçları",
    subTopics: [
      { id: 'sub4', title: "Genel Hükümler" },
      { id: 'sub5', title: "Özel Borç İlişkileri" },
    ]
  },  {
    id: 5,
    title: "Borçların Sona Erme Sebepleri",
    subTopics: [
      { id: 'sub4', title: "Genel Hükümler" },
      { id: 'sub5', title: "Özel Borç İlişkileri" },
    ]
  }
  ,{
    id: 6,
    title: "Borç İlişkisinde Özel Durumlar",
    subTopics: [
      { id: 'sub4', title: "Genel Hükümler" },
      { id: 'sub5', title: "Özel Borç İlişkileri" },
    ]
  }  ,{
    id: 7,
    title: "Sözleşmenin Devri, Alacağın Devri ve Borcun Üstlenilmesi",
    subTopics: [
      { id: 'sub4', title: "Genel Hükümler" },
      { id: 'sub5', title: "Özel Borç İlişkileri" },
    ]
  },
  
];

const AccordionItem = ({ course, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const height = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(100);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: interpolate(
        height.value,
        [0, contentHeight],
        [0, 1]
      ),
      overflow: 'hidden',
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const toggleAccordion = () => {
    const finalHeight = isExpanded ? 0 : contentHeight;
    height.value = withSpring(finalHeight, {
      damping: 20,
      mass: 0.8,
      stiffness: 120,
      velocity: 0.5
    });

    rotation.value = withTiming(isExpanded ? 0 : 180, {
      duration: 250
    });

    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const subTopicsHeight = course.subTopics.length * 60;
    setContentHeight(subTopicsHeight);
  }, [course.subTopics]);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.topicItem}
        onPress={toggleAccordion}
        activeOpacity={1}
      >
        <Text style={styles.topicTitle}>{course.title}</Text>
        <Animated.View style={iconStyle}>
          <Ionicons
            name="chevron-down"
            size={24}
            color={colors.primary}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[styles.subTopicsContainer, animatedStyles]}
      >
        {course.subTopics.map((subTopic) => (
          <TouchableOpacity
            key={subTopic.id}
            style={styles.subTopicItem}
            onPress={() => navigation.navigate('Whiteboard', { topicId: subTopic.id })}
          >
            <Text style={styles.subTopicTitle}>{subTopic.title}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

export default function CoursesDetailScreen() {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <AccordionItem course={item} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={coursesData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContainer: {
    padding: 16,
  },
  accordionContainer: {
    marginBottom: 8,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subTopicsContainer: {
    marginLeft: 20,
  },
  subTopicItem: {
    padding: 12,
    backgroundColor: colors.background.card,
    borderLeftWidth: 2,
    borderColor: colors.primary,
    marginTop: 4,
  },
  subTopicTitle: {
    fontSize: 16,
    color: colors.primary,
  },
});