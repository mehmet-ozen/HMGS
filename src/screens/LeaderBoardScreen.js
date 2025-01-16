import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ViewToken,
  SafeAreaView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeInDown
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '../data/images';

const { width } = Dimensions.get('window');
const TOP_AVATAR_SIZE = width * 0.15;
const LIST_AVATAR_SIZE = width * 0.12;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function LeaderBoardScreen() {
  const [users, setUsers] = useState([
    { id: 0, fullName: 'ABC' },
    { id: 1, fullName: 'ABC' },
    { id: 2, fullName: 'ABC' },
    { id: 3, fullName: 'ABC' },
    { id: 4, fullName: 'ABC' },
    { id: 5, fullName: 'ABC' },
    { id: 6, fullName: 'ABC' },
    { id: 7, fullName: 'ABC' },
    { id: 8, fullName: 'ABC' },
  ]);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState('weekly'); // 'weekly', 'monthly', 'allTime'
  const { user } = useAuth();
  const viewableItems = useSharedValue([]);

  useEffect(() => {
    // fetchLeaderboard();
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .orderBy('points', 'desc')
        .limit(50)
        .get();

      const leaderboardData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data(),
      }));

      setUsers(leaderboardData);
    } catch (error) {
      console.error('Leaderboard yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const TopThreeItem = ({ item, rank }) => {

    return (
      <View style={[styles.topThreeItem, rank === 1 && styles.firstPlace]}>
        <View style={styles.avatarContainer}>
          <Image
            source={images.avatars[4]}
            style={styles.topThreeAvatar}
          />
          {rank === 1 && (
            <View style={styles.crownContainer}>
              <Ionicons name="disc-sharp" size={24} color="#FFD700" />
            </View>
          )}
        </View>
        <Text style={styles.topThreeName} numberOfLines={1}>
          {item.fullName}
        </Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.points}>{item.points || 0}</Text>
        </View>
      </View>
    );
  };

  const ListItem = React.memo(({ item }) => {
    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          .filter((item) => item.isViewable)
          .find((viewableItem) => viewableItem.item.id === item.id)
      );

      return {
        opacity: withTiming(isVisible ? 1 : 0, { duration: 200 }),
        transform: [
          {
            scale: withTiming(isVisible ? 1 : 0.8, { duration: 200 }),
          }
        ],
      };
    }, []);

    return (
      <Animated.View style={[styles.listItem, rStyle]}>
        <Text style={styles.rank}>#{item.rank}</Text>
        <Image
          source={images.avatars[3]}
          style={styles.listAvatar}
        />
        <Text style={styles.name} numberOfLines={1}>
          {item.fullName}
        </Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.points}>{item.points || 0}</Text>
        </View>
      </Animated.View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lider Tablosu</Text>
        <Text style={styles.subtitle}>Son 24 Saat</Text>
      </View>

      <View style={styles.topThreeContainer}>
        {users.slice(1, 2).map((item) => (
          <TopThreeItem key={item.id} item={item} rank={2} />
        ))}
        {users.slice(0, 1).map((item) => (
          <TopThreeItem key={item.id} item={item} rank={1} />
        ))}
        {users.slice(2, 3).map((item) => (
          <TopThreeItem key={item.id} item={item} rank={3} />
        ))}
      </View>

      <AnimatedFlatList
        data={users}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.listContainer}
        overScrollMode='never'
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.white,
    opacity: 0.8,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 30,

  },
  topThreeItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: width * 0.25,
  },
  firstPlace: {
    transform: [{ translateY: -20 }],
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  topThreeAvatar: {
    width: TOP_AVATAR_SIZE,
    height: TOP_AVATAR_SIZE,
    borderRadius: TOP_AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  crownContainer: {
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: [{ translateX: -12 }],
  },
  topThreeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  listContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding:20,
  },
  listContainer:{
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  currentUserItem: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  rank: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  listAvatar: {
    width: LIST_AVATAR_SIZE,
    height: LIST_AVATAR_SIZE,
    borderRadius: LIST_AVATAR_SIZE / 2,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  points: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
});