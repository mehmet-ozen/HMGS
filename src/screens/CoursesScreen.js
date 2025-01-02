import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  FlatList
} from 'react-native';
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
  { id: 0, title: "Hepsi", isSelected: true },
  { id: "SEPARATOR" },
  { id: 1, title: "Medeni Hukuk", CoursesIDS: [0, 1, 2] },
  { id: 2, title: "Anayasa Hukuku", CoursesIDS: [3, 4, 5] },
  { id: 3, title: "Ceza Hukuku", CoursesIDS: [6, 7, 8] },
  { id: 4, title: "Borçlar ve Ticaret Hukuku", CoursesIDS: [9, 10, 11] },
];

const CategoryItem = React.memo(({ item, isSelected, onSelect }) => {
  if (item.id === "SEPARATOR") {
    return <View style={styles.separator} />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => onSelect(item.id)}>
      <View style={[
        styles.categoryItem,
        isSelected && styles.categoryItemSelected
      ]}>
        <Text style={[
          styles.categoryText,
          isSelected && styles.categoryTextSelected
        ]}>
          {item.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

const CourseItem = React.memo(({ item, onPress }) => (
  <TouchableWithoutFeedback
    onPress={(event) => onPress(item, event.nativeEvent)}
  >
    <Animated.View
      entering={FadeIn.duration(300)}
      style={styles.courseItem}
    >
      <Image
        source={courseImages[item.image]}
        style={styles.courseImage}
      />
      <Text style={styles.courseTitle}>{item.title}</Text>
      <View style={styles.iconContainer}>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={item.isSelected ? colors.text.white : colors.primary}
        />
      </View>
    </Animated.View>
  </TouchableWithoutFeedback>
));

const ModelContent = React.memo(({ selectedCourse, onNotePress }) => {

  return (
    <View style={styles.modalContainer}>
      <TouchableWithoutFeedback onPress={() => onNotePress(selectedCourse)}>
        <View style={[styles.modalButton, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.modalButtonText, { color: colors.text.white }]}>
            Not Oku
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback>
        <View style={[styles.modalButton, { backgroundColor: colors.background.primary }]}>
          <Text style={styles.modalButtonText}>Soru Çöz</Text>
        </View>
      </TouchableWithoutFeedback>
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

    const filtered = categoryId === 0
      ? courses.courses
      : courses.courses.filter(course =>
        category.CoursesIDS.includes(course.id)
      );

    setFilteredCourses(filtered.sort((a, b) => b.isSelected - a.isSelected));
  }, []);

  const handleCoursePress = useCallback((item, event) => {
    if (!event) return;
    toggleSheet();
    setSelectedCourse(item);
  }, []);


  const handleNotePress = useCallback((course) => {
    if (!course) return;
    navigation.navigate("CoursesDetail", { course: course, type: "note" });
    toggleSheet();
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
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={item => item.id.toString()}
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
    height: 40,
    width: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  categoryItem: {
    width: 120,
    height: 45,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  categoryItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  categoryText: {
    fontSize: 12,
    color: colors.text.black,
  },
  categoryTextSelected: {
    fontWeight: 'bold',
  },
  courseItem: {
    width: width - 32,
    height: COURSE_ITEM_HEIGHT,
    borderRadius: 25,
    backgroundColor: colors.background.primary,
    flexDirection: "row",
    alignItems: 'center',
    elevation: 8,
    marginVertical: 8,
    alignSelf: 'center',
  },
  courseImage: {
    width: 80,
    height: 80,
    marginLeft: 12,
    borderRadius: 20,
  },
  courseTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginHorizontal: 10,
  },
  iconContainer: {
    padding: 10,
    marginRight: 10,
  },
  categoriesContainer: {
    paddingVertical: 20,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: 'center',
    height: height * 0.25,
  },
  modalButton: {
    height: 65,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});