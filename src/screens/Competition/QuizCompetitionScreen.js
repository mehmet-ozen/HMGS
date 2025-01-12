import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { Pressable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';
const { width } = Dimensions.get('window');
import lessons from '../../data/competitionQuestion.json';


const CompetitorCard = ({ competitor, isUser }) => (
  <View style={[styles.competitorCard, isUser && styles.userCard]}>
    <View style={styles.competitorInfo}>
      <Image
        source={isUser ? require('../../../assets/images/pp_8.png') : require('../../../assets/images/pp_3.png')}
        style={styles.avatarImage}
      />
      <View>
        <Text style={styles.competitorName}>{competitor.name}</Text>
        <Text style={styles.competitorScore}>{competitor.score} Puan</Text>
      </View>
    </View>
  </View>
);

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
      </View>
    </Pressable>
  );
};
const competitors = {
  user: {
    name: "Sen",
    score: 120,
    lastAnswer: 'correct'
  },
  opponent: {
    name: "Rakip",
    score: 90,
    lastAnswer: 'wrong'
  }
};

export default function QuizCompetitionScreen({ route }) {
  const { selectedItemID } = route.params;
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [question, setQuestion] = useState({id: '', question: '', options: [], answer: ''});

  useEffect(() => {
      if(selectedItemID){
        const lesson = lessons.lessons.find(lesson => lesson.id === selectedItemID);
        console.log(lesson);
        if(lesson){
          const randomQuestion = lesson.questions[Math.floor(Math.random() * lesson.questions.length)];
          setQuestion(randomQuestion);
        }
      }
        
  }, [selectedItemID]);

  const handleOptionSelect = (index) => {
    if (!showResult) {
      setSelectedOption(index);
      // Burada rakibe göndermek için socket işlemleri yapılabilir
    }
    handleCheckAnswer();
  };
  const handleCheckAnswer = () => {
    setShowResult(true);
    if (selectedOption === question.answer) {
      // setScore(prev => prev + 1);
    }else{
      Vibration.vibrate(100);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.competitorsContainer}>
        <CompetitorCard competitor={competitors.user} isUser={true} />
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <CompetitorCard competitor={competitors.opponent} isUser={false} />
      </View>


      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.question}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            index={index}
            selected={selectedOption}
            correct={question.answer}
            showResult={showResult}
            onSelect={handleOptionSelect}
          />
        ))}
      </View>

      {/* <View 
        style={styles.bottomContainer}
      >
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            !showResult && selectedOption === null && styles.buttonDisabled,
            pressed && styles.buttonPressed,
            showResult && styles.nextButton,
          ]}
          onPress={handleCheckAnswer}
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
        </Pressable>}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    padding: 16,
  },

  competitorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    zIndex: 2,
    paddingHorizontal: 10,
  },
  competitorCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  userCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  competitorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  competitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  competitorScore: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  vsContainer: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.text.white,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.white,
  },
  answerIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.text.white,
  },
  correctAnswer: {
    backgroundColor: colors.success,
  },
  wrongAnswer: {
    backgroundColor: colors.error,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  questionNumberText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  timerText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  questionContainer: {
    flex: 1,
    backgroundColor: colors.background.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.border.dark,
    justifyContent: 'center',
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
    textAlign: 'center',
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
    backgroundColor: colors.status.success,
  },
  optionIndexWrong: {
    backgroundColor: colors.status.error,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  optionCorrect: {
    borderColor: colors.status.success,
    backgroundColor: `${colors.status.success}80`,
  },
  optionWrong: {
    borderColor: colors.status.error,
    backgroundColor: `${colors.status.error}80`,
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
    color: colors.text.white,
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
