import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { Pressable } from 'react-native-gesture-handler';

const SubTopicItemHeight = 60;
const SubTopicItemMargin = 6;

const AccordionItem = ({ course, navigation }) => {
  const isExpanded = useSharedValue(false);
  const rotation = useSharedValue(0);
  const height = useSharedValue(0);
  const marginBottom = 16;
  const contentHeight = (SubTopicItemHeight + SubTopicItemMargin) * course.subTopics.length + marginBottom;

  const animatedStyles = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(height.value, [0, contentHeight], [0, 1]),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleNotePress = () => {
    const finalHeight = isExpanded.value ? 0 : contentHeight;
    height.value = withTiming(finalHeight, {
      duration: 300,
    });
    rotation.value = withTiming(isExpanded.value ? 0 : 180, {
      duration: 250
    });
    isExpanded.value = !isExpanded.value;
  };



  return (
    <Animated.View style={styles.accordionContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.topicItem,
          pressed && styles.topicItemPressed
        ]}
        onPress={handleNotePress}
      >
        <View style={styles.topicHeader}>
          <View style={styles.topicInfo}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="book-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.topicTitle} numberOfLines={1}>
                {course.title}
              </Text>
              <Text style={styles.topicSubtitle}>
                {course.subTopics.length} alt başlık
              </Text>
            </View>
          </View>
          
          <Animated.View style={[styles.chevronContainer, iconStyle]}>
            <Ionicons
              name="chevron-down"
              size={24}
              color={colors.primary}
            />
          </Animated.View>
        </View>
      </Pressable>

      <Animated.View style={[styles.animatedContainer, animatedStyles]}>
        <FlatList
          data={course.subTopics}
          maxToRenderPerBatch={10}
          windowSize={4}
          removeClippedSubviews={true}
          scrollEnabled={false}
          overScrollMode="never"
          collapsable={false}
          getItemLayout={(data, index) => ({
            length: SubTopicItemHeight + SubTopicItemMargin,
            offset: (SubTopicItemHeight + SubTopicItemMargin) * index,
            index,
          })}
          renderItem={({ item: subTopic, index }) => (
            <Pressable
              key={subTopic.id}
              style={({ pressed }) => [
                styles.subTopicItem,
                pressed && styles.subTopicItemPressed,
              ]}
              onPress={() => {
                navigation.navigate('Notes', { topic: subTopic });
              }}
            >
              <View style={styles.subTopicContent}>
                <View style={styles.subTopicNumber}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                <View style={styles.subTopicInfo}>
                  <Text style={styles.subTopicTitle} numberOfLines={1}>
                    {subTopic.title}
                  </Text>
                  <Text style={styles.subTopicDuration}>15 dakika</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons name="arrow-forward" size={20} color={colors.text.light} />
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(subTopic) => subTopic.id}
          style={styles.subTopicsContainer}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default function CoursesDetailScreen({ route }) {
  const navigation = useNavigation();
  const { course } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: course.title,
    });
  }, []);
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={course.topics}
        renderItem={({ item }) => (
          <AccordionItem 
            course={item} 
            navigation={navigation}
          />
        )}
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
    marginBottom: 16,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
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
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  topicSubtitle: {
    fontSize: 13,
    color: colors.text.light,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTopicsContainer: {
    paddingHorizontal: 16,
  },
  subTopicItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: SubTopicItemMargin,
    height: SubTopicItemHeight,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  subTopicItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  subTopicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    height: '100%',
  },
  subTopicNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '600',
  },
  subTopicInfo: {
    flex: 1,
  },
  subTopicTitle: {
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: 4,
    fontWeight: '500',
  },
  subTopicDuration: {
    fontSize: 12,
    color: colors.text.light,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  animatedContainer: {
    overflow: 'hidden',
  },
});