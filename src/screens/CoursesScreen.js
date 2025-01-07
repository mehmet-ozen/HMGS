import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  FlatList,
  Vibration
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInDown,
  SlideOutDown,
  useSharedValue
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import courses from '../data/courses.json';
import BottomSheet from '../components/BottomSheet';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const COURSE_ITEM_HEIGHT = 100;

// Statik görsel importları
const courseImages = {
  is_hukuku: require('../../assets/images/is_hukuku.png'),
  anayasa_hukuku: require('../../assets/images/anayasa_hukuku.png'),
  aile_hukuku: require('../../assets/images/aile_hukuku.png'),
  borclar_hukuku: require('../../assets/images/borclar_hukuku.png'),
  icra_iflas_hukuku: require('../../assets/images/icra_iflas_hukuku.png'),
  medeni_usul_hukuku: require('../../assets/images/medeni_usul_hukuku.png'),
  esya_hukuku: require('../../assets/images/esya_hukuku.png'),
  miras_hukuku: require('../../assets/images/miras_hukuku.png'),
};

// Kategori verileri
const CATEGORIES = [
  { id: 0, title: "Hepsi" },
  { id: "SEPARATOR" },
  {
    id: 1,
    title: "Medeni Hukuk",
    courseCodes: ["aile_hukuku", "miras_hukuku", "esya_hukuku"]
  },
  {
    id: 2,
    title: "Anayasa Hukuku",
    courseCodes: ["anayasa_hukuku"]
  },
  {
    id: 3,
    title: "İcra Hukuku",
    courseCodes: ["icra_iflas_hukuku", "medeni_usul_hukuku"]
  },
  {
    id: 4,
    title: "Borçlar Hukuku",
    courseCodes: ["borclar_hukuku", "is_hukuku"]
  },
];

const CategoryItem = React.memo(
  ({ item, isSelected, onSelect }) => {
    if (item.id === "SEPARATOR") {
      return <View style={styles.separator} />;
    }

    return (
      <Pressable onPress={() => onSelect(item.id)}>
        <Animated.View
          style={[
            styles.categoryItem,
            isSelected && styles.categoryItemSelected,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              isSelected && styles.categoryTextSelected,
            ]}
          >
            {item.title}
          </Text>
        </Animated.View>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    // Sadece isSelected değiştiğinde yeniden renderla
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);

const CourseItem = ({ item, onPress }) => {
  const handlePress = (event) => {
    Vibration.vibrate(50);
    onPress(item, event);
  };

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={{ color: colors.primary }}
      hitSlop={20}
      pressRetentionOffset={20}
      style={({ pressed }) => (pressed ? styles.coursePressed:styles.courseItem)}
    >
       <View style={styles.courseInnerContainer}>
        <Image
          source={courseImages[item.image]}
          style={styles.courseImage}
        />
        <View style={styles.courseContent}>
          <Text style={styles.courseTitle}>{item.title}</Text>

          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Ionicons name="book-outline" size={16} color={colors.text.light} />
              <Text style={styles.statText}>12 Konu</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color={colors.text.light} />
              <Text style={styles.statText}>2 Saat</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: `${item.progress || 30}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{item.progress || 30}%</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.primary}
          />
        </View>
      </View>
    </Pressable>

  );
};

const ModelContent = React.memo(({ selectedCourse, onNotePress }) => {
  const handleNotePress = () => {
    Vibration.vibrate(50);
    setTimeout(() => {
      onNotePress(selectedCourse);
    }, 100);
  };

  const handleQuizPress = () => {
    Vibration.vibrate(50);
    // Quiz fonksiyonu eklendiğinde buraya eklenecek
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Image
          source={courseImages[selectedCourse?.image]}
          style={styles.modalImage}
        />
        <View style={styles.modalTitleContainer}>
          <Text style={styles.modalTitle}>{selectedCourse?.title}</Text>
          <View style={styles.modalStats}>
            <View style={styles.modalStatItem}>
              <Ionicons name="book-outline" size={14} color={colors.text.white} />
              <Text style={styles.modalStatText}>12 Konu</Text>
            </View>
            <View style={styles.modalStatItem}>
              <Ionicons name="time-outline" size={14} color={colors.text.white} />
              <Text style={styles.modalStatText}>2 Saat</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.modalProgress}>
        <Text style={styles.modalProgressTitle}>İlerleme Durumu</Text>
        <View style={styles.modalProgressBar}>
          <Animated.View
            style={[
              styles.modalProgressFill,
              { width: `${selectedCourse?.progress || 30}%` }
            ]}
          />
        </View>
        <Text style={styles.modalProgressText}>{selectedCourse?.progress || 30}%</Text>
      </View>

      <View style={styles.modalButtons}>
        <Pressable
          onPress={handleNotePress}
          style={({ pressed }) => [
            styles.modalButton,
            styles.modalButtonPrimary,
            pressed && styles.modalButtonPressed
          ]}
        >
          <Ionicons name="book" size={24} color={colors.text.white} />
          <View style={styles.modalButtonTextContainer}>
            <Text style={styles.modalButtonText}>Not Oku</Text>
            <Text style={styles.modalButtonSubText}>Konuları incele</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handleQuizPress}
          style={({ pressed }) => [
            styles.modalButton,
            styles.modalButtonSecondary,
            pressed && styles.modalButtonPressed
          ]}
        >
          <Ionicons name="help-circle" size={24} color={colors.primary} />
          <View style={styles.modalButtonTextContainer}>
            <Text style={[styles.modalButtonText, { color: colors.primary }]}>
              Soru Çöz
            </Text>
            <Text style={[styles.modalButtonSubText, { color: colors.text.secondary }]}>
              25 soru mevcut
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
});

export default function CoursesScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [filteredCourses, setFilteredCourses] = useState(courses.courses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const isOpen = useSharedValue(0);
  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);

    const category = CATEGORIES.find(cat => cat.id === categoryId);

    if (!category || categoryId === 0) {
      // "Hepsi" seçildiğinde tüm kursları göster
      setFilteredCourses(courses.courses);
      return;
    }

    // Seçilen kategorinin kurs kodlarına göre filtreleme yap
    const filtered = courses.courses.filter(course =>
      category.courseCodes.includes(course.image)
    );

    setFilteredCourses(filtered);
  }, []);

  const handleCoursePress = useCallback((item, event) => {
    console.log("Clicked!", !event === true);
    if (!event) return;
    setSelectedCourse(item);
    toggleSheet();
  }, [selectedCourse]);


  const handleNotePress = useCallback((course) => {
    console.log("Note pressed!");
    if (!course) return;
    // Önce modalı kapat, sonra navigate et
    isOpen.value = 0;

    // Modal kapanma animasyonu bitince navigate et
    setTimeout(() => {
      navigation.navigate("CoursesDetail", { course: course, type: "note" });
    }, 150); // Modal kapanma animasyonunun yarısı kadar bekle
  }, []);


  return (
    <View style={styles.container}>
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={filteredCourses}
        keyExtractor={item => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.coursesContainer}
        renderItem={({ item }) => (
          <CourseItem
            item={item}
            onPress={handleCoursePress}
          />
        )}
        ListHeaderComponent={
          <Animated.FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={item => item.id === "SEPARATOR" ? "sep" : item.id.toString()}
            renderItem={({ item }) => (
              <CategoryItem
                item={item}
                isSelected={selectedCategory === item.id}
                onSelect={handleCategorySelect}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            style={{ flexGrow: 0 }}
            overScrollMode="never"
          />
        }
        showsVerticalScrollIndicator={false}
      />


      <BottomSheet
        isOpen={isOpen}
        toggleSheet={toggleSheet}
        duration={500}
      >
        <ModelContent
          selectedCourse={selectedCourse}
          onNotePress={handleNotePress}
        />
      </BottomSheet>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  separator: {
    height: 25,
    width: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  categoryItem: {
    minWidth: 100,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryItemSelected: {
    backgroundColor: colors.primary,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  categoryTextSelected: {
    color: colors.text.white,
    fontWeight: 'bold',
  },
  courseItem: {
    width: width - 32,
    height: COURSE_ITEM_HEIGHT + 20,
    marginVertical: 8,
  },
  courseInnerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  courseImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
  },
  courseContent: {
    flex: 1,
    marginLeft: 12,
    height: '100%',
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: colors.text.light,
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.light,
    width: 35,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  coursesContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: height * 0.45,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  modalStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  modalStatText: {
    fontSize: 12,
    color: colors.text.light,
    marginLeft: 4,
  },
  modalProgress: {
    marginBottom: 24,
  },
  modalProgressTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  modalProgressBar: {
    height: 6,
    backgroundColor: colors.background.secondary,
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  modalProgressText: {
    fontSize: 12,
    color: colors.text.light,
    alignSelf: 'flex-end',
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  modalButtonTextContainer: {
    marginLeft: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  modalButtonSubText: {
    fontSize: 12,
    color: colors.text.white,
    opacity: 0.8,
  },
  coursePressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  modalButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});