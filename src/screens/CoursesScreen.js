import { View, Text, StyleSheet, Button, TouchableHighlight, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image, Platform, UIManager, LayoutAnimation } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut, LinearTransition, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';

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

function Catagories({ setFilteredCourses, coursesData }) {
  const [catagoriesData, setCatagoriesData] = useState([
    { id: 0, title: "Hepsi", icon: "check-to-slot", isSelected: true },
    { id: "SEPARATOR", title: "", icon: "", isSelected: false },
    { id: 1, title: "Medeni Hukuk", icon: "people-group", isSelected: false, CoursesIDS: [0,1,2] },
    { id: 2, title: "Anayasa Hukuku", icon: "book-open", isSelected: false, CoursesIDS: [3,4,5]},
    { id: 3, title: "Ceza Hukuku", icon: "fingerprint", isSelected: false, CoursesIDS: [6,7,8] },
    { id: 4, title: "Borçlar ve Ticaret Hukuku", icon: "money-check-dollar", isSelected: false, CoursesIDS: [9,10,11] },
  ]);



  const selectCategory = (id) => {
    const updatedData = catagoriesData.map(item =>
      item.id === id
        ? { ...item, isSelected: true }
        : { ...item, isSelected: false }
    );
    setCatagoriesData(updatedData);
  
    // Kategorilere göre kursları filtrele
    let filtered = [];
    if (id === 0) {
      filtered = coursesData; // "Hepsi" seçildiğinde tüm kurslar
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
    //<FontAwesome6 name={item.icon} size={26} color={item.isSelected ? colors.text.white : colors.primary} style={{ textAlign: 'center', top: 25, position: 'absolute' }} />
    return (
      item.id === "SEPARATOR" ? <View style={{ height: 40, width: 1, backgroundColor: colors.primary, borderRadius: 10, position: 'absolute', alignSelf: "center" }} /> :
        <TouchableWithoutFeedback onPress={() => selectCategory(item.id)} >
          <View style={[styles.CatagoriesItemStyle, { backgroundColor: item.isSelected ? colors.primaryLight : colors.background.primary}]}>
            <Text style={[styles.CatagoriesText, {color: item.isSelected ? colors.text.black : colors.text.black , fontWeight: item.isSelected ? 'bold' : 'normal' }]}>{item.title}</Text>
          </View>
        </TouchableWithoutFeedback>
    )
  }

  return (
    <View style={{ borderColor: '#800020', paddingVertical: 20}}>
      <FlatList
        style={{ flexGrow: 0}}
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

export default function CoursesScreen() {
  const navigation = useNavigation();


  const [coursesData, setCoursesData] = useState([
    { id: 0, title: "İş Hukuku", isSelected: false, img: "is_hukuku" },
    { id: 2, title: "Anayasa Hukuku", isSelected: false, img: "anayasa_hukuku" },
    { id: 3, title: "Aile Hukuku", isSelected: false, img: "aile_hukuku" },
    { id: 4, title: "Borçlar Hukuku", isSelected: false, img: "borclar_hukuku"  },
    { id: 9, title: "İcra ve İflas Hukuku", isSelected: false, img: "icra_iflas_hukuku" },
    { id: 13, title: "Medeni Usul Hukuku", isSelected: false, img: "medeni_usul_hukuku" },
    { id: 14, title: "Eşya Hukuku", isSelected: false, img: "esya_hukuku" },
    { id: 15, title: "Miras Hukuku", isSelected: false, img: "miras_hukuku" },
  ]);

  const [filteredCourses, setFilteredCourses] = useState(coursesData);


  const DailyQuestion = () => {
    return (
      <View style={styles.DailyQuestionStyle}>
        <Text style={styles.DQTextStyle}>Sözleşmenin ahlaka aykırı olması kesin hükümsüzlük hallerindendir.</Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableHighlight style={styles.DQGButtonStyle}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#F5F5DC", textAlign: 'center' }}>DOĞRU</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.DQRButtonStyle}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#F5F5DC", textAlign: 'center' }}>YANLIŞ</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  const handleBookmarkClick = (id) => {
    setFilteredCourses((prevCourses) => {
      const updatedCourses = [...prevCourses]; // Diziyi kopyalayarak çalışıyoruz.
      const currentIndex = updatedCourses.findIndex((course) => course.id === id);
      const currentCourse = updatedCourses[currentIndex];

      // Seçili durumu tersine çevir
      currentCourse.isSelected = !currentCourse.isSelected;

      if (!currentCourse.isSelected) {
        // Unselect ediliyorsa:
        // Altında seçili bookmark'ları kontrol et
        let nextIndex = currentIndex + 1;

        while (
          nextIndex < updatedCourses.length &&
          updatedCourses[nextIndex].isSelected
        ) {
          // Yer değiştir
          [updatedCourses[nextIndex - 1], updatedCourses[nextIndex]] = [
            updatedCourses[nextIndex],
            updatedCourses[nextIndex - 1],
          ];
          nextIndex++;
        }
        // Unselect edilen bookmark en son sıraya kadar hareket ettirilebilir.
      } else {
        // Select ediliyorsa:
        // Mevcut öğeyi en üst sıraya taşı
        updatedCourses.splice(currentIndex, 1); // Mevcut yerden kaldır
        updatedCourses.unshift(currentCourse); // En üste ekle
      }

      return updatedCourses;
    });
  };
  function CoursesItem({ item }) {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate('CoursesDetail', { courseTitle: item.title })}>
        <View style={styles.CoursesItemStyle}>
          <Image
            source={courseImages[item.img]}
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


  //<Catagories setFilteredCourses={setFilteredCourses} coursesData={coursesData} />
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
        style={{  }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40}}
        ItemSeparatorComponent={() => { return <View style={{ marginVertical: 8 }} /> }}
      />
    </View>
  )
}



const styles = StyleSheet.create({
  DailyQuestionStyle: {
    marginTop: 25,
    marginHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.background.card,
    paddingVertical: 20,

  },
  DQTextStyle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: 10,
  },
  DQGButtonStyle: {
    width: 120,
    height: 40,
    backgroundColor: colors.status.success,
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 20,

  },
  DQRButtonStyle: {
    width: 120,
    height: 40,
    backgroundColor: colors.status.error,
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 20,

  },
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
    textAlign:'center',

  },
  CoursesItemStyle: {
    width: 360,
    height: 100,
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
    alignSelf:"center",
    justifyContent: "center",
    right: 10,
    backgroundColor: colors.background.primary,
  },
});