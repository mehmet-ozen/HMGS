import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeIn, 
} from 'react-native-reanimated';
import { Pressable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';


const OptionButton = ({ option, index, selected, correct, showResult, onSelect }) => {
  const isWrong = showResult && selected === index && index !== correct;
  const showCorrectAnswer = showResult && index === correct;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.optionButton,
        selected === index && styles.optionSelected,
        showCorrectAnswer && styles.optionCorrect,
        isWrong && styles.optionWrong,
        pressed && !showResult && styles.optionPressed,
      ]}
      onPress={() => !showResult && onSelect(index)}
      disabled={showResult}
    >
      <View style={styles.optionContent}>
        <View style={[
          styles.optionIndex,
          selected === index && styles.optionIndexSelected,
          showCorrectAnswer && styles.optionIndexCorrect,
          isWrong && styles.optionIndexWrong,
        ]}>
          <Text style={[
            styles.optionIndexText,
            (selected === index || showCorrectAnswer || isWrong) && 
            styles.optionIndexTextSelected
          ]}>
            {String.fromCharCode(65 + index)}
          </Text>
        </View>
        <Text style={[
          styles.optionText,
          (selected === index || showCorrectAnswer || isWrong) && 
          styles.optionTextSelected
        ]}>
          {option}
        </Text>
        {showResult && (
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={styles.resultIcon}
          >
            <Ionicons
              name={showCorrectAnswer ? "checkmark-circle" : isWrong ? "close-circle" : ""}
              size={24}
              color={showCorrectAnswer ? colors.status.success : colors.status.error}
            />
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
};

export default function QuizScreen({ route }) {
  const { selectedTopics } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: "Borçlar hukukunda sebepsiz zenginleşmenin temel şartı nedir?",
      options: [
        "Zenginleşme",
        "Fakirleşme",
        "Hukuki sebep yokluğu",
        "İade talebi"
      ],
      correct: 2
    },
    // Diğer sorular...
  ];

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
    if (selectedOption === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }else{
      Vibration.vibrate(100);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1}/{questions.length}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionNumber}>Soru {currentQuestion + 1}</Text>
        <Text style={styles.questionText}>
          {questions[currentQuestion].question}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {questions[currentQuestion].options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            index={index}
            selected={selectedOption}
            correct={questions[currentQuestion].correct}
            showResult={showResult}
            onSelect={handleOptionSelect}
          />
        ))}
      </View>

      <View 
        style={styles.bottomContainer}
      >
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            !showResult && selectedOption === null && styles.buttonDisabled,
            pressed && styles.buttonPressed,
            showResult && styles.nextButton,
          ]}
          onPress={showResult ? handleNextQuestion : handleCheckAnswer}
          disabled={!showResult && selectedOption === null}
        >
          <Text style={styles.buttonText}>
            {showResult ? "Sonraki Soru" : "Kontrol Et"}
          </Text>
          <Ionicons 
            name={showResult ? "arrow-forward" : "checkmark"} 
            size={24} 
            color={colors.text.white} 
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  questionContainer: {
    backgroundColor: colors.background.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  optionIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIndexSelected: {
    backgroundColor: colors.primary,
  },
  optionIndexCorrect: {
    backgroundColor: colors.success,
  },
  optionIndexWrong: {
    backgroundColor: colors.error,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  optionCorrect: {
    borderColor: colors.status.success,
    backgroundColor: `${colors.status.success}50`,
  },
  optionWrong: {
    borderColor: colors.status.error,
    backgroundColor: `${colors.status.error}50`,
  },
  optionPressed: {
    transform: [{ scale: 0.98 }],
  },
  optionIndexText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  optionIndexTextSelected: {
    color: colors.text.white,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  optionTextSelected: {
    fontWeight: '500',
  },
  resultIcon: {
    marginLeft: 'auto',
  },
  bottomContainer: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButton: {
    backgroundColor: colors.success,
  },
  buttonDisabled: {
    backgroundColor: colors.button.disabled,
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});