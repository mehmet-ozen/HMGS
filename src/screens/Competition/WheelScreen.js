import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

import lessons from '../../data/competitionQuestion.json'
import { Wheel } from '../../components/Wheel';
import { Header, HeaderBackButton } from '@react-navigation/elements';


const saveLessonsData = async () => {
  try {
    const batch = firestore().batch();
    lessons.lessons.forEach((lessonData) => {
        console.log(lessonData); // lessonData'yı konsola yazdırarak kontrol edin.
    
        const docName = lessonData.id; // Dersi belirle
        // Veriyi Firestore formatına dönüştür
        if (lessonData.questions && Array.isArray(lessonData.questions)) {
            const formattedData = {
                questions: lessonData.questions.map(question => ({
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.answer,
                }))
            };
            console.log(formattedData); // formattedData'yı kontrol edin
    
            const lessonRef = firestore().collection('competition_questions').doc(docName);
            batch.set(lessonRef, formattedData);
        }
    });

    // Batch işlemini çalıştır
    await batch.commit();
    console.log('Tüm dersler başarıyla kaydedildi!');
    Alert.alert('Başarılı', 'Tüm dersler veritabanına kaydedildi.');
    
  } catch (error) {
    console.error('Hata detayı:', error);
    Alert.alert('Hata', 'Dersler kaydedilirken bir hata oluştu: ' + error.message);
  }
};


export default function WheelScreen() {
    const navigation = useNavigation();

    const handleSpinEnd = (selectedItem, color) => {
        console.log('Seçilen:', selectedItem);
        setTimeout(() => {
            navigation.replace('QuizCompetition', { selectedItemID: selectedItem.id, selectedColor:selectedItem.color });
        }, 300);
    };

    return (
        <View style={styles.container}>
            <Header 
            back={()=><HeaderBackButton pressOpacity={0}/>}  
            headerTintColor={colors.primary}
            headerShadowVisible={false}
            />
            <View style={styles.header}>
                <Text style={styles.title}>Konu Çarkı</Text>
                <Text style={styles.subtitle}>Çarkı çevirerek rastgele bir konudan quiz çöz!</Text>
            </View>
            <Wheel onSpinEnd={handleSpinEnd}/>
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
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});

