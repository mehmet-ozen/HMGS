import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform, Pressable, Vibration } from 'react-native';
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
import { StatusBar } from 'expo-status-bar';

const AccordionItem = ({ course, navigation }) => {
  const isExpanded = useSharedValue(false);
  const rotation = useSharedValue(0);
  const height = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(200);

  const animatedStyles = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(height.value, [0, contentHeight], [0, 1]),

  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));


  const toggleAccordion = () => {
    const finalHeight = isExpanded.value ? 0 : contentHeight;
    height.value = withTiming(finalHeight, {
      duration: 300,
    });

    rotation.value = withTiming(isExpanded.value ? 0 : 180, {
      duration: 250
    });

    isExpanded.value = !isExpanded.value;
  };
  
console.log(course);
  return (
    <Animated.View style={styles.accordionContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.topicItem,
          pressed && styles.topicItemPressed
        ]}
        onPress={toggleAccordion}
      >
        <View style={styles.topicHeader}>
          <View style={styles.topicInfo}>
            <Ionicons
              name="book-outline"
              size={24}
              color={colors.primary}
              style={styles.topicIcon}
            />
            <View>
              <Text style={styles.topicTitle}>{course.title}</Text>
              <Text style={styles.topicSubtitle}>
                {course.subTopics.length} alt başlık
              </Text>
            </View>
          </View>
          <Animated.View style={iconStyle}>
            <Ionicons
              name="chevron-down"
              size={24}
              color={colors.primary}
            />
          </Animated.View>
        </View>
      </Pressable>
      <Animated.FlatList
        data={course.subTopics}
        renderItem={({item: subTopic, index}) => (
          <Pressable
            key={subTopic.id}
            style={({ pressed }) => [
              styles.subTopicItem,
              pressed && styles.subTopicItemPressed
            ]}
            onPress={() => {
              Vibration.vibrate(50);
              setTimeout(() => {
                navigation.navigate('Notes', { topic: subTopic });
              }, 100);
            }}
          >
            <View style={styles.subTopicContent}>
              <View style={styles.subTopicNumber}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <View style={styles.subTopicInfo}>
                <Text style={styles.subTopicTitle}>{subTopic.title}</Text>
                <Text style={styles.subTopicDuration}>15 dakika</Text>
              </View>
            <Ionicons name="arrow-forward" size={20} color={colors.text.light} />
            </View>
          </Pressable>
        )}
        keyExtractor={(subTopic) => subTopic.id}
        style={[styles.subTopicsContainer, animatedStyles]}
      />
    </Animated.View>
  );
};

export default function CoursesDetailScreen({ route }) {
  const navigation = useNavigation();
  const { course, type } = route.params;
  const renderItem = ({ item }) => (
    <AccordionItem course={item} navigation={navigation} />
  );
  useEffect(() => {
    navigation.setOptions({
      title: course.title,
    });
  }, [course]);
  return (
    <View style={styles.container}>
      {course === null ? <Text>Ders Bulunamadı</Text> :
        <Animated.FlatList
          data={course.topics}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />}
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
    marginBottom: 16,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  topicItem: {
    padding: 16,
  },
  topicItemPressed: {
    opacity: 0.8,
    backgroundColor: colors.background.secondary,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicIcon: {
    marginRight: 12,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  topicSubtitle: {
    fontSize: 13,
    color: colors.text.light,
    marginTop: 2,
  },
  subTopicsContainer: {
    paddingHorizontal: 16,
    overflow: 'hidden',

  },
  subTopicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginTop: 8,
  },
  subTopicItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  subTopicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subTopicNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  subTopicInfo: {
    flex: 1,
  },
  subTopicTitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  subTopicDuration: {
    fontSize: 12,
    color: colors.text.light,
  },
});