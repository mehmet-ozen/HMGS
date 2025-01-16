import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { Pressable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';




const TopicItem = ({ topic, onSelect, isSelected }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.topicItem,
        isSelected && styles.topicItemSelected,
        pressed && styles.topicItemPressed
      ]}
      onPress={() => onSelect(topic)}
    >
      <View style={styles.topicInfo}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="book-outline"
            size={24}
            color={colors.primary}
          />
        </View>
        <Text style={styles.topicTitle} numberOfLines={1}>
          {topic.title}
        </Text>
      </View>
      
      <View style={styles.checkboxContainer}>
        <Ionicons
          name={isSelected ? "checkbox" : "square-outline"}
          size={24}
          color={colors.primary}
        />
      </View>
    </Pressable>

  );
};

export default function QuizTopicsScreen({ route }) {
  const navigation = useNavigation();
  const { course } = route.params;
  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleTopicSelect = (topic) => {
    setSelectedTopics(prev => {
      const isSelected = prev.some(item => item.id === topic.id);
      if (isSelected) {
        return prev.filter(item => item.id !== topic.id);
      }
      return [...prev, topic];
    });
  };

  const handleStartQuiz = () => {
    if (selectedTopics.length === 0) return;
    navigation.navigate('Quiz', { 
      selectedTopics,
      courseName: course.title
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: course.title,
    });
  }, [course.title]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={course.topics}
        renderItem={({ item }) => (
          <TopicItem 
            topic={item}
            onSelect={handleTopicSelect}
            isSelected={selectedTopics.some(topic => topic.id === item.id)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <Animated.View 
        style={styles.bottomContainer}
      >
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
            selectedTopics.length === 0 && styles.startButtonDisabled
          ]}
          onPress={handleStartQuiz}
          disabled={selectedTopics.length === 0}
        >
          <Text style={styles.startButtonText}>
            Çözmeye Başla {selectedTopics.length > 0 && `(${selectedTopics.length})`}
          </Text>
          <Ionicons name="arrow-forward" size={24} color={colors.text.white} />
        </Pressable>
      </Animated.View>
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
    paddingBottom: 100,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,

  },
  topicItemSelected: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  topicItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  topicInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  bottomContainer: {
    position: 'relative',
    height: 100,
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  startButtonDisabled: {
    backgroundColor: colors.button.disabled,
    opacity: 0.7,
  },
  startButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 