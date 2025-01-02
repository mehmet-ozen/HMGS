import { View, Text, StyleSheet, Button, TouchableHighlight, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image, Platform, UIManager, LayoutAnimation, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut, LinearTransition, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import courses from '../data/courses.json';
import { Canvas, CornerPathEffect, Path, Skia } from '@shopify/react-native-skia';

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

const COURSE_ITEM_HEIGHT = 100;
const MODAL_SPACING = 20; // Modal ile kurs arası mesafe
const MODAL_HEIGHT = 150; // Modal yüksekliği

function Catagories({ setFilteredCourses, coursesData }) {
  const [catagoriesData, setCatagoriesData] = useState([
    { id: 0, title: "Hepsi", icon: "check-to-slot", isSelected: true },
    { id: "SEPARATOR", title: "", icon: "", isSelected: false },
    { id: 1, title: "Medeni Hukuk", icon: "people-group", isSelected: false, CoursesIDS: [0, 1, 2] },
    { id: 2, title: "Anayasa Hukuku", icon: "book-open", isSelected: false, CoursesIDS: [3, 4, 5] },
    { id: 3, title: "Ceza Hukuku", icon: "fingerprint", isSelected: false, CoursesIDS: [6, 7, 8] },
    { id: 4, title: "Borçlar ve Ticaret Hukuku", icon: "money-check-dollar", isSelected: false, CoursesIDS: [9, 10, 11] },
  ]);



  const selectCategory = (id) => {
    const updatedData = catagoriesData.map(item =>
      item.id === id
        ? { ...item, isSelected: true }
        : { ...item, isSelected: false }
    );
    setCatagoriesData(updatedData);

    let filtered = [];
    if (id === 0) {
      filtered = coursesData;
    } else {
      coursesData.forEach(course => {
        if (catagoriesData.find(cat => cat.id === id).CoursesIDS.includes(course.id)) {
          filtered.push(course);
        }
      });
    }

    // Bookmarked courses should be at the top
    filtered.sort((a, b) => b.isSelected - a.isSelected);

    setFilteredCourses(filtered);
  };



  function CatagoriesItem({ item }) {
    return (
      item.id === "SEPARATOR" ? <View style={{ height: 40, width: 1, backgroundColor: colors.primary, borderRadius: 10, position: 'absolute', alignSelf: "center" }} /> :
        <TouchableWithoutFeedback onPress={() => selectCategory(item.id)} >
          <View style={[styles.CatagoriesItemStyle, { backgroundColor: item.isSelected ? colors.primaryLight : colors.background.primary }]}>
            <Text style={[styles.CatagoriesText, { color: item.isSelected ? colors.text.black : colors.text.black, fontWeight: item.isSelected ? 'bold' : 'normal' }]}>{item.title}</Text>
          </View>
        </TouchableWithoutFeedback>
    )
  }

  return (
    <View style={{ borderColor: '#800020', paddingVertical: 20 }}>
      <FlatList
        style={{ flexGrow: 0 }}
        data={catagoriesData}
        horizontal={true}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <CatagoriesItem item={item} />}
        overScrollMode='never'
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => { return <View style={{ marginHorizontal: 5 }} /> }}
      />
    </View>

  )
}

function CourseActionModal({ isVisible, onClose, position, course }) {
  const navigation = useNavigation();

  if (!isVisible) return null;

  const screenHeight = Dimensions.get('window').height;
  const BOTTOM_SPACING = MODAL_SPACING; 

  const isNearBottom = position.y + MODAL_HEIGHT + BOTTOM_SPACING > screenHeight - 100;

  const modalTop = isNearBottom
    ? position.y - COURSE_ITEM_HEIGHT * 2 - BOTTOM_SPACING * 2 - 18
    : position.y + BOTTOM_SPACING + 10
  const TriangleSign = () => {
    const roundedTrianglePath = `M 50 10L 0 90L 100 90Z`;
    const scaleX = 30 / 100;
    const scaleY = 30 / 100;
    return (
      <Canvas style={{ 
        width: 30, height: 30, position: 'absolute', 
        alignSelf: "center",
        top: isNearBottom? null : -18,
        bottom: isNearBottom? -18 : null,
        transform: [{ rotate: isNearBottom? "180deg" : "0deg" }],
        }}>
        <Path
          path={roundedTrianglePath}
          style="fill"
          color={colors.primary}
          transform={[{ scaleX }, { scaleY }]}
          strokeJoin={"round"}
        >
          <CornerPathEffect r={15} />
        </Path>

      </Canvas>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <Animated.View 
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[styles.modalContainer, {
            position: 'absolute',
            top: modalTop,
          }]}>
            <TriangleSign />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                onPress={() => { navigation.navigate("CoursesDetail", { course: course, type: "note" }), onClose() }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text.white }]}>Not Oku</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background.primary }]}
                onPress={() => { }}
              >
                <Text style={styles.modalButtonText}>Soru Çöz</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function CoursesScreen() {

  const coursesData = courses.courses;
  const [filteredCourses, setFilteredCourses] = useState(coursesData);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  function CoursesItem({ item }) {
    const itemRef = React.useRef();

    const handlePress = () => {
      itemRef.current.measure((x, y, width, height, pageX, pageY) => {
        setModalPosition({ x: pageX, y: pageY });
        setSelectedCourse(item);
        setIsModalVisible(true);
      });
    };

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <View ref={itemRef} style={styles.CoursesItemStyle}>
          <Image
            source={courseImages[item.image]}
            style={styles.CoursesImage}
          />
          <Text
            adjustsFontSizeToFit
            style={styles.courseTitle}>
            {item.title}
          </Text>

          <TouchableWithoutFeedback onPress={(e) => {
            e.stopPropagation();
          }}>
            <View style={styles.IconContainer}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={item.isSelected ? colors.text.white : colors.primary}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={filteredCourses}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CoursesItem item={item} />}
        ListHeaderComponent={<Catagories setFilteredCourses={setFilteredCourses} coursesData={coursesData} />}
        overScrollMode='never'
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
        ItemSeparatorComponent={() => { return <View style={{ marginVertical: 8 }} /> }}
      />
      <CourseActionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        course={selectedCourse}
        position={modalPosition}
      />
    </View>
  )
}



const styles = StyleSheet.create({
  CatagoriesItemStyle: {
    width: 120,
    height: 45,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  CatagoriesText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 12,
    textAlign: 'center',

  },
  CoursesItemStyle: {
    width: 360,
    height: COURSE_ITEM_HEIGHT,
    borderRadius: 25,
    backgroundColor: colors.background.primary,
    borderColor: colors.background.secondary,
    flexDirection: "row",
    alignItems: 'center',
    position: 'relative',
    elevation: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginHorizontal: 10,
  },
  CoursesImage: {
    width: 80,
    height: 80,
    marginLeft: 12,
    borderRadius: 20,
  },
  IconContainer: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    right: 10,
    backgroundColor: colors.background.primary,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '70%',
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },

  modalButtonContainer: {
    gap: 15,
  },
  modalButton: {
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  modalButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});