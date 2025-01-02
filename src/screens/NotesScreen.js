import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    LinearTransition,
    interpolate,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SlideModal from '../components/SlideModal';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
    // Örnek not verileri
    const notes = [
        {
            id: '1',
            title: 'Giriş',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
            id: '2',
            title: 'Temel Kavramlar',
            content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
            id: '3',
            title: 'Önemli Noktalar',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            id: '4',
            title: 'Önemli Noktalar',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            id: '5',
            title: 'Önemli Noktalar',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            id: '6',
            title: 'Önemli Noktalar',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
    ];

const SPRING_CONFIG = { damping: 15, stiffness: 100 };

const NoteCard = React.memo(({ title, content }) => (
  <Animated.View layout={LinearTransition} style={styles.noteCard}>
    <Text style={styles.noteTitle}>{title}</Text>
    <Text style={styles.noteContent}>{content}</Text>
  </Animated.View>
));

const NavigationButton = React.memo(({ onPress, disabled, icon }) => (
  <TouchableOpacity
    style={[styles.navButton, disabled && styles.navButtonDisabled]}
    onPress={onPress}
    disabled={disabled}
    delayPressOut={100}
  >
    <Ionicons 
      name={icon} 
      size={24} 
      color={disabled ? colors.text.light : colors.primary} 
    />
  </TouchableOpacity>
));

export default function NotesScreen({ route }) {
  const { topic } = route.params;
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const progressAnimation = useSharedValue(0);

  const isOpen = useSharedValue(0);
  const toggleSheet = useCallback(() => {
    isOpen.value = isOpen.value === 0 ? 1 : 0;
  }, []);

  useEffect(() => {
    if (navigation.isFocused()) {
    navigation.setOptions({ 
        title: topic.title,
        headerRight: () => (
          <TouchableWithoutFeedback onPress={toggleSheet} style={{padding:10}}>
            <View style={styles.closeButton}>
                <Ionicons name="close-circle" size={28} color={colors.status.error} />
            </View>
          </TouchableWithoutFeedback>
        )
    });
    updateProgress(0);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (isOpen.value === 0) {
            e.preventDefault();
            toggleSheet();
        }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, toggleSheet]);

  const updateProgress = (page) => {
    progressAnimation.value = withSpring(
      ((page + 1) / notes.length) * 100, 
      SPRING_CONFIG
    );
  };

  const changePage = (newPage) => {
    flatListRef.current?.scrollToIndex({
      index: newPage,
      animated: true
    });
    setCurrentPage(newPage);
    updateProgress(newPage);
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnimation.value}%`,
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  }));


  const handleExit = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
                <Text style={[styles.pageCounter,{position:'absolute',right:0,height:'100%',width:20,borderRadius:2,backgroundColor:colors.background.secondary,color:colors.text.secondary}]}>{notes.length}</Text>
              <Animated.View style={progressStyle} >
                <Text style={[styles.pageCounter,{position:'absolute',right:0,height:'100%',width:25,borderRadius:5}]}>{currentPage + 1}</Text>
              </Animated.View>
            </View>
          </View>
        </View>

        <Animated.FlatList
          ref={flatListRef}
          data={notes}
          renderItem={({ item }) => <NoteCard {...item} />}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          style={{flexGrow: 0, height: height * 0.8}}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />

        <View style={styles.navigationButtons}>
          <NavigationButton
            onPress={() => changePage(currentPage - 1)}
            disabled={currentPage === 0}
            icon="chevron-back"
          />
          <NavigationButton
            onPress={() => changePage(currentPage + 1)}
            disabled={currentPage === notes.length - 1}
            icon="chevron-forward"
          />
        </View>

        <SlideModal
          isOpen={isOpen}
          toggleModal={toggleSheet}
          duration={300}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Çıkmak istediğinize emin misiniz?</Text>
            <View style={styles.modalButtons}>


              <TouchableWithoutFeedback 
                style={[styles.modalButton, { backgroundColor: colors.background.primary, borderWidth:1, borderColor:colors.primary }]}
                onPress={toggleSheet}
              >
                <Text style={[styles.modalButtonText,{color:colors.primary}]}>Hayır</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback 
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleExit}
              >
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </SlideModal>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
  },
  progressContainer: {
    marginTop: 8,
    borderRadius: 5,
  },
  counterContainer: {
    marginBottom: 8,
  },
  pageCounter: {
    fontSize: 12,
    color: colors.text.white,
    textAlign: 'center',
    backgroundColor: colors.secondary,
    position:'absolute',
    right:0,
    height:'100%',
    width:20,
    borderRadius:2,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 5,
    
  },
  noteCard: {
    width: width - 32,
    margin: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  closeButton: {
    
  },
  modalContainer: {    
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width:'80%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});