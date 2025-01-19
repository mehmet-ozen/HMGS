import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, Dimensions, ActivityIndicator } from 'react-native';

import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

import lessons from '../../data/competitionQuestion.json'
import { Wheel } from '../../components/Wheel';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import images from '../../data/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

const AVATAR_SIZE = height <= 720 ? 40 : 80;

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


const CompetitorHeader = ({ match }) => {
    const currentUser  = auth().currentUser;
    
    const currentPlayer = match.player1.userId === currentUser.uid ? match.player1 : match.player2;
    const opponentPlayer = match.player1.userId === currentUser.uid ? match.player2 : match.player1;

    return (
        <View style={styles.header}>
            <View style={styles.itemContainer}>
                {/* Mevcut Oyuncu */}
                <View style={styles.competitorContainer}>
                    <View style={styles.competitorInfo}>
                        <Text style={styles.competitorName}>Sen</Text>
                    </View>
                    <Avatar user={currentPlayer} />
                    <View style={styles.scoreBox}>
                        <Text style={styles.scoreText}>{currentPlayer.score}</Text>
                        <Ionicons name="star" size={24} color="#FFD700" />
                    </View>
                </View>

                {/* VS Bölümü */}
                <View style={styles.scoresContainer}>
                    <View style={styles.vsContainer}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>
                </View>

                {/* Rakip Oyuncu */}
                <View style={styles.competitorContainer}>
                    <View style={styles.competitorInfo}>
                        <Text style={styles.competitorName}>Rakip</Text>
                    </View>
                    <Avatar user={opponentPlayer} />
                    <View style={styles.scoreBox}>
                        <Ionicons name="star" size={24} color="#FFD700" />
                        <Text style={styles.scoreText}>{opponentPlayer.score}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default function WheelScreen({route}) {
    const {match} = route.params;
    const navigation = useNavigation();

    const handleSpinEnd = (selectedItem, color) => {
        setTimeout(() => {
            navigation.replace('QuizCompetition', { selectedItemID: selectedItem.id, selectedColor: selectedItem.color, match:match });
        }, 300);
    };

    
  if (!match) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
    return (
        <View style={styles.container}>
            <Header
                back={() => <HeaderBackButton pressOpacity={0} />}
                headerTintColor={colors.primary}
                headerShadowVisible={false}
            />
            <CompetitorHeader match={match}/>
            <Wheel onSpinEnd={handleSpinEnd} />
            {/* <View style={styles.wheelContainer}>

            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
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
    wheelContainer: {
        marginBottom: 40,
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: "center",
        justifyContent: 'flex-end',
    },
    compatitorsContainer: {
    },
    compotitorsAvatar: {
        width: height <= 720 ? 40 : 80,
        height: height <= 720 ? 40 : 80,
        borderRadius: AVATAR_SIZE
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pointContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    pointsText: {
        fontWeight: 600,
        fontSize: 20
    },
    vsContainer: {
        padding: 20,
    },
    vsText: {
        fontWeight: 600,
        fontSize: 24,
        color: colors.text.secondary
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background.card,
        borderRadius: 20,
        padding: 16,

    },
    competitorContainer: {
        alignItems: 'center',
        gap: 8,
    },
    competitorAvatar: {
        width: height <= 720 ? 60 : 80,
        height: height <= 720 ? 60 : 80,
        borderRadius: 80,
        borderWidth: 2,
        borderColor: colors.border.light,
    },
    competitorInfo: {
        alignItems: 'center',
    },
    competitorName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text.primary,
    },
    scoresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    scoreBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: `${colors.primary}15`,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: `${colors.primary}30`,
    },
    scoreText: {
        fontSize: 25,
        fontWeight: '700',
        color: colors.text.primary,
    },
    vsContainer: {
        width: 80,
        height: 80,
        borderRadius: 80,
        backgroundColor: `${colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vsText: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: '800',
    },
});

