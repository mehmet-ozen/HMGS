import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Pressable
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = width * 0.12;

export default function MatchupsScreen({ navigation }) {
  const [activeMatches, setActiveMatches] = useState([
    {
      id: '1',
      player1: { id: 'user1', name: 'Sen', score: 1200, photo: 1 },
      player2: { id: 'user2', name: 'Ahmet K.', score: 800, photo: 2 },
      status: 'waiting', // waiting, completed
      isYourTurn: true,
      winner: 'user1'
    },
    {
      id: '2',
      player1: { id: 'user1', name: 'Sen', score: 900, photo: 1 },
      player2: { id: 'user2', name: 'Mehmet Y.', score: 200, photo: 3 },
      status: 'completed',
      isYourTurn: false,
      winner: 'user1'
    }
    ,
    {
      id: '3',
      player1: { id: 'user1', name: 'Sen', score: 900, photo: 1 },
      player2: { id: 'user2', name: 'Mehmet Y.', score: 1200, photo: 3 },
      status: 'completed',
      isYourTurn: false,
      winner: 'user2'
    }
  ]);

  const renderMatchupItem = ({ item }) => {
    const isCompleted = item.status === 'completed';
    const isWaiting = item.status === 'waiting';
    const isWinner = isCompleted && item.winner === 'user1';
    const isLoser = isCompleted && item.winner !== 'user1';

    const renderMatchStatus = () => {
      if (!isCompleted) return null;

      return (
        <View style={[
          styles.matchStatusContainer,
          isWinner ? styles.winStatusContainer : styles.loseStatusContainer
        ]}>
          <Text style={[
            styles.matchStatusText,
            isWinner ? styles.winStatusText : styles.loseStatusText
          ]}>
            {isWinner ? 'Kazandın' : 'Kaybettin'}
          </Text>
        </View>
      );
    };

    return (
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={styles.matchupCard}
      >
        <View style={styles.matchupContent}>
          {/* Player 1 */}
          <View style={[
            styles.playerInfo,
            isWinner && styles.winnerInfo,
            isLoser && styles.loserInfo
          ]}>
            <Text style={styles.playerName}>{item.player1.name}</Text>
            <Image
              source={require('../../../assets/images/pp_1.png')}
              style={styles.avatar}
            />
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{item.player1.score || '-'}</Text>
              <Ionicons name="star" size={16} color="#FFD700" />
            </View>
          </View>

          {/* VS Section */}
          <View style={styles.vsContainer}>
            <View style={styles.vsCircle}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            {isWaiting && item.isYourTurn ? (
              <View style={styles.turnIndicator}>
                <Text style={styles.turnText}>Senin Sıran!</Text>
              </View>
            ) : renderMatchStatus()}
          </View>

          {/* Player 2 */}
          <View style={[
            styles.playerInfo,
            isCompleted && item.winner === item.player2.id && styles.winnerInfo,
            isCompleted && item.winner !== item.player2.id && styles.loserInfo
          ]}>
            <Text style={styles.playerName}>{item.player2.name}</Text>
            <Image
              source={require('../../../assets/images/pp_2.png')}
              style={styles.avatar}
            />
            <View style={styles.scoreContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.score}>{item.player2.score || 'Bekliyor'}</Text>
            </View>
          </View>
        </View>

        {isWaiting && item.isYourTurn && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate('WheelScreen')}
          >
            <Text style={styles.playButtonText}>Oyna</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>

      {/* Active Matches */}
      <FlatList
        data={activeMatches}
        renderItem={({ item }) => renderMatchupItem({ item, type: 'active' })}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.matchupsList}
      />

      {/* Find Match Button */}
      <View
        style={styles.bottomContainer}
      >
        <Pressable
          style={({ pressed }) => [
            pressed
              ? [styles.findMatchButton, styles.pressedFindMatchButton]
              : styles.findMatchButton
          ]}
          onPress={() => { }}
        >
          <Ionicons name="search" size={24} color={colors.text.white} />
          <Text style={styles.findMatchText}>
            Yeni Rakip Bul
          </Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  findMatchButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressedFindMatchButton: {
    backgroundColor: "#1C86EE",
    transform: [{ scale: 0.96 }],
  },
  findMatchText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  matchupsList: {
    paddingHorizontal: 20,
  },
  matchupCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  matchupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  playerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  loserInfo: {
    flex: 1,
    alignItems: 'center',
    opacity:0.5,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginBottom: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  score: {
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vsContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 4,
  },
  turnIndicator: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  turnText: {
    fontSize: 12,
    color: colors.text.white,
    fontWeight: '500',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    
  },
  playButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  matchStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  winStatusContainer: {
    backgroundColor: colors.status.success,
  },
  loseStatusContainer: {
    backgroundColor: colors.status.error,
  },
  matchStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: colors.text.white,
  },
  winStatusText: {
    color: colors.text.white,
  },
  loseStatusText: {
    color: colors.text.white,
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
}); 