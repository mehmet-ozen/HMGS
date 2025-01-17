import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Vibration,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  LinearTransition,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import courses from '../../data/courses.json';
const { width, height } = Dimensions.get('window');
const COURSE_ITEM_HEIGHT = 100;



// Statik görsel importları
const courseImages = {
  is_hukuku: require('../../../assets/images/is_hukuku.png'),
  anayasa_hukuku: require('../../../assets/images/anayasa_hukuku.png'),
  aile_hukuku: require('../../../assets/images/aile_hukuku.png'),
  borclar_hukuku: require('../../../assets/images/borclar_hukuku.png'),
  icra_iflas_hukuku: require('../../../assets/images/icra_iflas_hukuku.png'),
  medeni_usul_hukuku: require('../../../assets/images/medeni_usul_hukuku.png'),
  esya_hukuku: require('../../../assets/images/esya_hukuku.png'),
  miras_hukuku: require('../../../assets/images/miras_hukuku.png'),
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
        <View
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
        </View>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
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
      style={({ pressed }) => [
        styles.courseItem,
        pressed && styles.coursePressed
      ]}
    >
      <View style={styles.courseInnerContainer}>
        <Image
          source={courseImages[item.image]}
          style={styles.courseImage}
        />
        <View style={styles.courseContent}>
          <Text style={styles.courseTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="book-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.statText}>12 Konu</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.statText}>2 Saat</Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="help-circle-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.statText}>25 Soru</Text>
            </View>

            {item.isPopular && (
              <View style={[styles.tag, styles.popularTag]}>
                <Text style={[styles.tagText, styles.popularTagText]}>Popüler</Text>
              </View>
            )}
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


export default function CoursesScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [filteredCourses, setFilteredCourses] = useState(courses.courses);

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

  const handleCoursePress = useCallback((item) => {
    console.log("Clicked!", item);
    if (!item) return;
    navigation.navigate("BottomFormSheet",{course:item});
  }, []);


  return (
    <View style={styles.container}>
      <FlatList
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
  },
  categoryItemSelected: {
    backgroundColor: colors.primary,
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
    borderWidth: 1,
    borderColor: colors.border.light,
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
    marginRight: 8,
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
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.text.light,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  popularTag: {
    backgroundColor: `${colors.success}15`,
  },
  popularTagText: {
    color: colors.success,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  coursesContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },

  coursePressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
  },
});