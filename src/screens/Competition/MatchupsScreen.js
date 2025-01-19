import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  Alert
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore'
import useMatch from '../../data/functions';
import { useAuth } from '../../context/AuthContext';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '../../components/Avatar';
const { width, height } = Dimensions.get('window');
const AVATAR_SIZE = width * 0.12;


export default function MatchupsScreen() {
  const { user, matchesIds } = useAuth();
  const navigation = useNavigation();
  const { status, matchId, findOrCreateMatch } = useMatch('spin_the_wheel');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const getMatches = async () => {
      try {
        // Kullanıcının matchIds'lerini kontrol et
        if (!user?.matchIds || user.matchIds.length === 0) {
          setMatches([]);
          return;
        }

        const matchesRef = firestore().collection('spin_the_wheel_matches');

        // Kullanıcının tüm maçlarını al
        const matchesSnapshot = await matchesRef
          .where(firestore.FieldPath.documentId(), 'in', user.matchIds)
          .get();

        const matchesData = matchesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(), // Timestamp'i Date'e çevir
        }));

        // Maçları tarihe göre sırala (en yeniden en eskiye)
        const sortedMatches = matchesData.sort((a, b) =>
          b.createdAt - a.createdAt
        );

        setMatches(sortedMatches);

      } catch (error) {
        console.error('Error fetching matches data:', error);
        Alert.alert(
          'Hata',
          'Maç geçmişi yüklenirken bir hata oluştu.'
        );
      }
    };

    getMatches();
  }, [user?.matchIds, matchId]); // user.matchIds değiştiğinde de yeniden yükle

  const renderMatchupItem = ({ item }) => {
    const isCompleted = item.status === 'completed';
    const isActive = item.status === 'active';
    const isWinner = isCompleted && item.winner === 'user1';
    const isLoser = isCompleted && item.winner !== 'user1';

    const currentUser = auth().currentUser;
    
    const currentPlayer = item.player1.userId === currentUser.uid ? item.player1 : item.player2;
    const opponentPlayer = item.player1.userId === currentUser.uid ? item.player2 : item.player1;

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
      <View
        style={styles.matchupCard}
      >
        <View style={styles.matchupContent}>
          {/* Player 1 */}
          <View style={[
            styles.playerInfo,
            isWinner && styles.winnerInfo,
            isLoser && styles.loserInfo
          ]}>
            <Text style={styles.playerName}>Sen</Text>
            <Avatar user={currentPlayer} size='small' />
            <View style={styles.scoreContainer}>
            <Text style={
              [
                styles.score,
                { color: currentPlayer.score < 0 ? colors.status.error : colors.text.s }
              ]
              }>{currentPlayer.score}</Text>
              <Ionicons name="star" size={16} color="#FFD700" />
            </View>
          </View>

          {/* VS Section */}
          <View style={styles.vsContainer}>
            <View style={styles.vsCircle}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            {isActive ? (
              <View style={styles.turnIndicator}>
                <Text style={styles.turnText}>Devam Ediyor!</Text>
              </View>
            ) : renderMatchStatus()}
          </View>

          {/* Player 2 */}
          <View style={[
            styles.playerInfo,
            isCompleted && item.winner === opponentPlayer.id && styles.winnerInfo,
            isCompleted && item.winner !== opponentPlayer.id && styles.loserInfo
          ]}>
            <Text style={styles.playerName}>{opponentPlayer.fullName}</Text>
            <Avatar user={opponentPlayer} size='small' />

            <View style={styles.scoreContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={
              [
                styles.score,
                { color: opponentPlayer.score < 0 ? colors.status.error : colors.text.primary }
              ]
              }>{opponentPlayer.score}</Text>
            </View>
          </View>
        </View>

        {isActive && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate('WheelScreen', { match: item })}
          >
            <Text style={styles.playButtonText}>Oyna</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleFindMatch = () => {
    findOrCreateMatch('spin_the_wheel');
  }

  useEffect(() => {
    if (status === 'active') {
      Alert.alert('Eşleşme bulundu!', `Karşılaşma ID: ${matchId}`);
      const currentMatch = matches.find((item) => {
        return item.id === matchId;
      });
      if (currentMatch !== 'undefined' && currentMatch) {
        navigation.navigate('WheelScreen', { match: currentMatch });
      }
    } else if (status === 'waiting') {
      Alert.alert('Bekleniyor...', 'Eşleşme için bir oyuncu bekleniyor.');
    }
  }, [status, matchId, matches])



  return (
    <View style={styles.container}>
      {/* Active Matches */}
      <FlatList
        data={matches}
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
          onPress={handleFindMatch}
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
    padding: height <= 720 ? 8 : 16,
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
    paddingTop: 20,
    paddingBottom: 100,
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
    opacity: 0.5,
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
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
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
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
}); 