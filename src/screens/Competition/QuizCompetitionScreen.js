import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Vibration } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CompetitorCard = ({ competitor, isUser, scoreChange }) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue('0deg');
  const scoreScale = useSharedValue(1);
  const scoreColor = useSharedValue(colors.text.primary);
  const pointChangeOpacity = useSharedValue(0);
  const pointChangeTranslateY = useSharedValue(0);

  useEffect(() => {
    if (scoreChange) {
      if (scoreChange < 0) {
        // Hasar animasyonu
        scale.value = withSequence(
          withTiming(0.95, { duration: 100 }),
          withSpring(1)
        );
        rotate.value = withSequence(
          withTiming('-2deg', { duration: 50 }),
          withTiming('2deg', { duration: 100 }),
          withTiming('0deg', { duration: 50 })
        );
        scoreScale.value = withSequence(
          withTiming(1.2, { duration: 100 }),
          withTiming(0.8, { duration: 100 }),
          withSpring(1)
        );
        scoreColor.value = withTiming(colors.error);
      } else {
        // Puan artış animasyonu
        scale.value = withSequence(
          withTiming(1.05, { duration: 100 }),
          withSpring(1)
        );
        scoreScale.value = withSequence(
          withTiming(1.3, { duration: 200 }),
          withSpring(1)
        );
        scoreColor.value = withTiming(colors.success);
      }

      // Puan değişim animasyonu
      pointChangeOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 200 })
      );
      pointChangeTranslateY.value = withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(-20, { duration: 800 }),
        withTiming(-40, { duration: 200 })
      );

      // Rengi normale döndür
      setTimeout(() => {
        scoreColor.value = withTiming(colors.text.primary);
      }, 500);
    }
  }, [scoreChange]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: rotate.value }
    ]
  }));

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
    color: scoreColor.value
  }));

  const pointChangeStyle = useAnimatedStyle(() => ({
    opacity: pointChangeOpacity.value,
    transform: [{ translateY: pointChangeTranslateY.value }],
  }));

  return (
    <Animated.View style={[styles.competitorCard, isUser && styles.userCard, cardStyle]}>
      {/* <Text style={styles.competitorName}>{competitor.name}</Text> */}
      <View style={styles.competitorInfo}>
        <Image
          source={isUser ? require('../../../assets/images/pp_8.png') : require('../../../assets/images/pp_3.png')}
          style={styles.avatarImage}
        />
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Animated.Text style={[styles.competitorScore, scoreStyle]}>
            {competitor.score}
          </Animated.Text>
          {scoreChange !== 0 && (
            <Animated.View style={[styles.pointChangeContainer, pointChangeStyle]}>
              <Text style={[
                styles.pointChangeText,
                scoreChange > 0 ? styles.positiveChange : styles.negativeChange
              ]}>
                {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

    </Animated.View>
  );
};

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
  const { selectedItemID, selectedColor } = route.params;
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [question, setQuestion] = useState({ id: '', question: '', options: [], answer: '' });
  const [loading, setLoading] = useState(true);
  const [scoreChange, setScoreChange] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      try {
        setLoading(true);
        // Seçilen dersin tüm sorularını getir
        const docRef = firestore().collection('competition_questions').doc(selectedItemID);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
          const docData = docSnapshot.data();
          if (docData && docData.questions && docData.questions.length > 0) {
            // questions array'ini kontrol ediyoruz
            const randomIndex = Math.floor(Math.random() * docData.questions.length);
            const randomQuestion = docData.questions[randomIndex];

            setQuestion({
              id: randomQuestion.id,
              question: randomQuestion.question,
              options: randomQuestion.options,
              answer: randomQuestion.correctAnswer,
            });
          } else {
            console.log('Sorular bulunamadı veya array boş.');
          }
        }
      } catch (error) {
        console.error('Soru yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedItemID) {
      fetchRandomQuestion();
    }
  }, [selectedItemID]);

  const handleOptionSelect = (index) => {
    if (!showResult) {
      setSelectedOption(index);
      const isCorrect = index === question.answer;

      // Skor değişimini ayarla
      const change = isCorrect ? 20 : -10;
      setScoreChange(change);

      // competitors state'ini güncelle
      competitors.user.score += change;

      if (!isCorrect) {
        Vibration.vibrate(100);
      }

      setShowResult(true);
    }
  };

  return (
    <View style={[styles.container, {
      paddingTop: insets.top + 20,
      paddingBottom: insets.bottom + 20,
      paddingLeft: insets.left + 10,
      paddingRight: insets.right + 10,
    }]}>
      <LinearGradient
        // Background Linear Gradient
        colors={[selectedColor, selectedColor, 'transparent']}
        style={styles.background}
      />
      <View style={styles.competitorsContainer}>
        <CompetitorCard
          competitor={competitors.user}
          isUser={true}
          scoreChange={scoreChange}
        />
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <CompetitorCard
          competitor={competitors.opponent}
          isUser={false}
        />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 16,
    position: 'relative',
    overflow: 'visible', // Puan değişimi animasyonu için
  },
  userCard: {
    backgroundColor: colors.background.card,
  },
  competitorInfo: {
    alignItems: 'center',
    gap: 12,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  competitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap: 6,
    backgroundColor: '`${colors.primary}20`',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  competitorScore: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  vsContainer: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
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
    backgroundColor: `${colors.background.primary}50`,
  },
  optionIndexCorrect: {
    backgroundColor: `${colors.background.primary}50`,
  },
  optionIndexWrong: {
    backgroundColor: `${colors.background.primary}50`,
  },
  optionSelected: {
  },
  optionCorrect: {
    backgroundColor: colors.status.success,
  },
  optionWrong: {
    backgroundColor: colors.status.error,
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    gap: 4,
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointChangeContainer: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    zIndex: 10,
  },
  pointChangeText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  positiveChange: {
    color: colors.status.success,
  },
  negativeChange: {
    color: colors.status.error,
  },
});
