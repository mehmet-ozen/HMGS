import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image as NativeImage, Button } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
    withSequence,
    useSharedValue,
    runOnJS,
    Easing,
    withSpring,
    withRepeat,
    cancelAnimation,
} from 'react-native-reanimated';
import {
    Canvas,
    Path,
    Group,
    Text as SkiaText,
    useFont,
    Image,
    useImageAsTexture
} from "@shopify/react-native-skia";
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

import lessons from '../../data/competitionQuestion.json'

const { width, height } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.95;
const CENTER_X = WHEEL_SIZE / 2;
const CENTER_Y = WHEEL_SIZE / 2;
const ITEM_COUNT = 8;
const ANGLE = (2 * Math.PI) / ITEM_COUNT;



const Wheel = ({ onSpinEnd }) => {
    const rotation = useSharedValue(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const circleScale = useSharedValue(0);
    const font = useFont(require("../../../assets/fonts/Roboto-Bold.ttf"), 14);
    const pointerRotation = useSharedValue(0);

    const borclar_icon = require('../../../assets/images/borclar_icon.png');
    const anayasa_icon = require('../../../assets/images/anayasa_icon.png');
    const ticaret_icon = require('../../../assets/images/ticaret_icon.png');
    const tarih_icon = require('../../../assets/images/tarih_icon.png');
    const ceza_icon = require('../../../assets/images/ceza_icon.png');
    const idare_icon = require('../../../assets/images/idare_icon.png');
    const medeni_icon = require('../../../assets/images/medeni_icon.png');
    const is_icon = require('../../../assets/images/is_icon.png');

    const wheelItems = [
        { id: 'medeni_hukuk', label: 'Medeni Hukuk', color: '#3498db', icon: 'book', image: useImageAsTexture(medeni_icon), nativeImage: medeni_icon },
        { id: 'borclar_hukuku', label: 'Borçlar Hukuku', color: '#9b59b6', icon: 'library', image: useImageAsTexture(borclar_icon), nativeImage: borclar_icon },
        { id: 'ceza_hukuku', label: 'Ceza Hukuku', color: '#e74c3c', icon: 'shield', image: useImageAsTexture(ceza_icon), nativeImage: ceza_icon },
        { id: 'idare_hukuku', label: 'İdare Hukuku', color: '#27ae60', icon: 'business', image: useImageAsTexture(idare_icon), nativeImage: idare_icon },
        { id: 'anayasa_hukuku', label: 'Anayasa Hukuku', color: '#f1c40f', icon: 'document', image: useImageAsTexture(anayasa_icon), nativeImage: anayasa_icon },
        { id: 'ticaret_hukuku', label: 'Ticaret Hukuku', color: '#e67e22', icon: 'cart', image: useImageAsTexture(ticaret_icon), nativeImage: ticaret_icon },
        { id: 'is_hukuku', label: 'İş Hukuku', color: '#16a085', icon: 'cash', image: useImageAsTexture(is_icon), nativeImage: is_icon },
        { id: 'hukuk_tarihi', label: 'Hukuk Tarihi', color: '#7f8c8d', icon: 'hammer', image: useImageAsTexture(tarih_icon), nativeImage: tarih_icon },
    ];

    const createSlicePath = (index) => {
        const startAngle = index * ANGLE - Math.PI / 2;
        const endAngle = startAngle + ANGLE;
        const radius = WHEEL_SIZE / 2 - 10;

        const x1 = CENTER_X + radius * Math.cos(startAngle);
        const y1 = CENTER_Y + radius * Math.sin(startAngle);
        const x2 = CENTER_X + radius * Math.cos(endAngle);
        const y2 = CENTER_Y + radius * Math.sin(endAngle);

        return `M ${CENTER_X} ${CENTER_Y} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    };

    const getTextPosition = (index) => {
        const angle = index * ANGLE + ANGLE / 2 - Math.PI / 2;
        const radius = WHEEL_SIZE / 3;
        return {
            x: CENTER_X + radius * Math.cos(angle),
            y: CENTER_Y + radius * Math.sin(angle),
        };
    };

    const getImagePosition = (index) => {
        const angle = index * ANGLE + ANGLE / 2 - Math.PI / 2;
        const radius = WHEEL_SIZE / 3.2;
        return {
            x: CENTER_X + radius * Math.cos(angle),
            y: CENTER_Y + radius * Math.sin(angle),
            rotate: angle + Math.PI / 2
        };
    };

    const handleSpinEnd = (finalValue) => {
        setIsSpinning(false);
        console.log(finalValue);
        // Normalize radians to degrees
        const normalizedRadians = finalValue % (2 * Math.PI);
        const normalizedDegrees = (normalizedRadians * 180) / Math.PI;

        // Adjust to match wheel orientation
        const adjustedDegrees = (360 - normalizedDegrees) % 360;

        // Find selected slice
        const sliceAngle = 360 / ITEM_COUNT;
        const selectedIndex = Math.floor(adjustedDegrees / sliceAngle) % ITEM_COUNT;
        const selectedItem = wheelItems[selectedIndex];

        setSelectedItem(selectedItem);

        circleScale.value = withSpring(1, {
            damping: 20,
            stiffness: 90,
        }, () => {
            runOnJS(onSpinEnd)(selectedItem);
        });
        stopPointerAnimation();
    };

    const startPointerAnimation = () => {
        pointerRotation.value = withRepeat(
            withSequence(
                withTiming(-0.1, { duration: 100, easing: Easing.linear }),
                withTiming(0.1, { duration: 100, easing: Easing.linear }),
            ),
            -1,
            true
        );
    };

    const stopPointerAnimation = () => {
        cancelAnimation(pointerRotation);
        pointerRotation.value = withSpring(0);
    };

    const spin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        startPointerAnimation();

        const currentRotation = rotation.value;
        const randomRotations = Math.floor(Math.random() * 5) + 5;
        const finalRotation = currentRotation + (randomRotations * 2 * Math.PI + Math.random() * 2 * Math.PI);

        rotation.value = withSequence(
            withTiming(finalRotation, {
                duration: 4000,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }, (finished) => {
                if (finished) {
                    runOnJS(handleSpinEnd)(finalRotation);
                }
            }),
        );
    };

    const wheelStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${(rotation.value * 180) / Math.PI}deg` }],
    }));

    const circleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: circleScale.value }],
            opacity: circleScale.value,
        };
    });

    const pointerStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${pointerRotation.value}rad` }],
    }));

    return (
        <View style={styles.wheelContainer}>
            <Animated.View style={[styles.wheel, wheelStyle]}>
                <Canvas style={styles.canvas}>
                    <Group origin={{ x: CENTER_X, y: CENTER_Y }}>
                        {wheelItems.map((item, index) => {
                            const image = item.image;
                            const imagePos = getImagePosition(index);
                            const IMAGE_SIZE = 80;
                            return (
                                <Group key={item.id}>
                                    <Path
                                        path={createSlicePath(index)}
                                        color={item.color}
                                    />
                                    {image && (
                                        <Group
                                            transform={[
                                                { translateX: imagePos.x },
                                                { translateY: imagePos.y },
                                                { rotate: imagePos.rotate },
                                            ]}
                                        >
                                            <Image
                                                image={image}
                                                x={-IMAGE_SIZE / 2}
                                                y={-IMAGE_SIZE / 2}
                                                width={IMAGE_SIZE}
                                                height={IMAGE_SIZE}
                                                fit="contain"
                                            />

                                        </Group>
                                    )}
                                </Group>
                            );
                        })}
                    </Group>
                </Canvas>
            </Animated.View>
            <Animated.Image
                source={require('../../../assets/images/pointer.png')}
                style={[styles.pointer, pointerStyle]}
            />
            <Pressable
                style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
                onPress={spin}
                disabled={isSpinning}
            >
                <Text style={styles.spinButtonText}>
                    {isSpinning ? '...' : 'ÇEVİR'}
                </Text>
            </Pressable>

            {selectedItem && (
                <Animated.View
                    style={[
                        styles.expandingCircle,
                        { backgroundColor: selectedItem.color },
                        circleStyle
                    ]}
                >
                    <View style={styles.expandingItemContainer}>
                        <Text style={styles.selectedItemText}>{selectedItem.label}</Text>
                        <NativeImage
                            source={selectedItem.nativeImage}
                            style={{ width: 300, height: 300 }}
                            resizeMode="cover"
                        />
                    </View>
                </Animated.View>
            )}
        </View>
    );
};
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

    const handleSpinEnd = (selectedItem) => {
        console.log('Seçilen:', selectedItem);
        setTimeout(() => {
            navigation.replace('QuizCompetition', { selectedItemID: selectedItem.id });
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Konu Çarkı</Text>
                <Text style={styles.subtitle}>Çarkı çevirerek rastgele bir konudan quiz çöz!</Text>
            </View>
            <Wheel onSpinEnd={handleSpinEnd} />
            <Button title='Sorulari Kaydet' onPress={saveLessonsData}/>
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
    wheelContainer: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    wheel: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        borderRadius: WHEEL_SIZE / 2,
        borderWidth: 5,
        borderColor: '#1a2342',
        position: 'relative',
        backgroundColor: '#1a2342',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    canvas: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        position: 'absolute',
    },
    pointer: {
        position: 'absolute',
        top: -25,
        width: 50,
        height: 50,
        zIndex: 2,
    },
    spinButton: {
        position: 'absolute',
        width: WHEEL_SIZE / 4,
        height: WHEEL_SIZE / 4,
        borderRadius: WHEEL_SIZE / 8,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        zIndex: 2,
        borderWidth: 4,
        borderColor: '#1a2342',
    },
    spinButtonDisabled: {
        opacity: 0.8,
        backgroundColor: colors.primary + 'CC', // %80 opaklık
    },
    spinButtonText: {
        color: colors.text.white,
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 1,
    },
    expandingCircle: {
        position: 'absolute',
        width: WHEEL_SIZE * 3,
        height: WHEEL_SIZE * 3,
        borderRadius: WHEEL_SIZE * 1.5,
        alignSelf: 'center',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandingItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50,
    },
    selectedImageCanvas: {
        width: WHEEL_SIZE * 1,
        height: WHEEL_SIZE * 1,
        position: 'absolute',
    },
    selectedItemText: {
        color: colors.text.primary,
        fontSize: 24,
        fontWeight: '800',
        padding: 15,
        backgroundColor: colors.background.primary,
        borderRadius: 10,
        letterSpacing: 1,
    },
});

