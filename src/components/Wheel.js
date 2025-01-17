import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, Dimensions, Image as NativeImage, StyleSheet } from 'react-native';
import { Canvas, Path, Group, Image, useImageAsTexture, useImage } from '@shopify/react-native-skia';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    withRepeat,
    cancelAnimation,
    useSharedValue,
    runOnJS,
    Easing
} from 'react-native-reanimated';
import images from '../data/images';
import { colors } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;
const WHEEL_SIZE = screenWidth * 0.95;
const CENTER_X = WHEEL_SIZE / 2;
const CENTER_Y = WHEEL_SIZE / 2;
const ITEM_COUNT = 8;
const ANGLE = (2 * Math.PI) / ITEM_COUNT;
const IMAGE_SIZE = 80;

export const Wheel = ({ onSpinEnd }) => {
    // Shared Values
    const rotation = useSharedValue(0);
    const circleScale = useSharedValue(0);
    const pointerRotation = useSharedValue(0);

    // State
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const wheelItems = [
        { id: 'medeni_hukuk', label: 'Medeni Hukuk', color: '#3498db', icon: 'book', image: useImage(images.lessonsIcons.medeni_icon), nativeImage: images.lessonsIcons.medeni_icon },
        { id: 'borclar_hukuku', label: 'Borçlar Hukuku', color: '#9b59b6', icon: 'library', image: useImage(images.lessonsIcons.borclar_icon), nativeImage: images.lessonsIcons.borclar_icon },
        { id: 'ceza_hukuku', label: 'Ceza Hukuku', color: '#e74c3c', icon: 'shield', image: useImage(images.lessonsIcons.ceza_icon), nativeImage: images.lessonsIcons.ceza_icon },
        { id: 'idare_hukuku', label: 'İdare Hukuku', color: '#27ae60', icon: 'business', image: useImage(images.lessonsIcons.idare_icon), nativeImage: images.lessonsIcons.idare_icon },
        { id: 'anayasa_hukuku', label: 'Anayasa Hukuku', color: '#f1c40f', icon: 'document', image: useImage(images.lessonsIcons.anayasa_icon), nativeImage: images.lessonsIcons.anayasa_icon },
        { id: 'ticaret_hukuku', label: 'Ticaret Hukuku', color: '#e67e22', icon: 'cart', image: useImage(images.lessonsIcons.ticaret_icon), nativeImage: images.lessonsIcons.ticaret_icon },
        { id: 'is_hukuku', label: 'İş Hukuku', color: '#16a085', icon: 'cash', image: useImage(images.lessonsIcons.is_icon), nativeImage: images.lessonsIcons.is_icon },
        { id: 'hukuk_tarihi', label: 'Hukuk Tarihi', color: '#7f8c8d', icon: 'hammer', image: useImage(images.lessonsIcons.tarih_icon), nativeImage: images.lessonsIcons.tarih_icon },
        // ... diğer items
    ];

    const slicePaths = () =>
        wheelItems.map((_, index) => {
            const startAngle = index * ANGLE - Math.PI / 2;
            const endAngle = startAngle + ANGLE;
            const radius = WHEEL_SIZE / 2 - 10;

            const x1 = CENTER_X + radius * Math.cos(startAngle);
            const y1 = CENTER_Y + radius * Math.sin(startAngle);
            const x2 = CENTER_X + radius * Math.cos(endAngle);
            const y2 = CENTER_Y + radius * Math.sin(endAngle);

            return `M ${CENTER_X} ${CENTER_Y} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
        });

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

        const normalizedRadians = finalValue % (2 * Math.PI);
        const normalizedDegrees = (normalizedRadians * 180) / Math.PI;
        const adjustedDegrees = (360 - normalizedDegrees) % 360;
        const sliceAngle = 360 / ITEM_COUNT;
        const selectedIndex = Math.floor(adjustedDegrees / sliceAngle) % ITEM_COUNT;
        const selected = wheelItems[selectedIndex];

        setSelectedItem(selected);
        circleScale.value = withSpring(1, {
            damping: 20,
            stiffness: 90,
        }, () => {
            runOnJS(onSpinEnd)(selected);
        });

        cancelAnimation(pointerRotation);
        pointerRotation.value = withSpring(0);
    };

    const spin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        // Pointer Animation
        pointerRotation.value = withRepeat(
            withSequence(
                withTiming(-0.1, { duration: 100 }),
                withTiming(0.1, { duration: 100 }),
            ),
            -1,
            true
        );

        // Wheel Spin Animation
        const currentRotation = rotation.value;
        const randomRotations = Math.floor(Math.random() * 5) + 5;
        const finalRotation = currentRotation + (randomRotations * 2 * Math.PI + Math.random() * 2 * Math.PI);

        rotation.value = withTiming(finalRotation, {
            duration: 1800,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }, (finished) => {
            if (finished) {
                runOnJS(handleSpinEnd)(finalRotation);
            }
        });
    };

    // Animated Styles
    const wheelStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${(rotation.value * 180) / Math.PI}deg` }],
    }));

    const circleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: circleScale.value }],
        opacity: circleScale.value,
    }));

    const pointerStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${pointerRotation.value}rad` }],
    }));

    const renderWheelItems = () => (
        <Group origin={{ x: CENTER_X, y: CENTER_Y }}>
            {wheelItems.map((item, index) => {
                const imagePos = getImagePosition(index);

                return (
                    <Group key={item.id}>
                        <Path
                            path={slicePaths()[index]}
                            color={item.color}
                        />
                        {item.image && (
                            <Group
                                transform={[
                                    { translateX: imagePos.x },
                                    { translateY: imagePos.y },
                                    { rotate: imagePos.rotate },
                                ]}
                            >
                                <Image
                                    image={item.image}
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
    );

    return (
        <View style={styles.wheelContainer}>
            <Animated.View style={[styles.wheel, wheelStyle]}>
                <Canvas style={styles.canvas}>
                    {renderWheelItems()}
                </Canvas>
            </Animated.View>

            <Animated.Image
                source={images.wheel.pointer}
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
                        <Text style={styles.selectedItemText}>
                            {selectedItem.label}
                        </Text>
                        <NativeImage
                            source={selectedItem.nativeImage}
                            style={styles.selectedImage}
                            resizeMode="cover"
                        />
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wheelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheel: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        borderColor:colors.border.light,
        borderWidth:2,
        borderRadius:WHEEL_SIZE,
        alignItems:"center",
        justifyContent:"center",
    },
    canvas: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
    },
    pointer: {
        width: 40,
        height: 40,
        position: 'absolute',
        top:-10
    },
    spinButton: {
        position: 'absolute',
        width: WHEEL_SIZE / 4,
        height: WHEEL_SIZE / 4,
        borderRadius: WHEEL_SIZE / 8,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        zIndex: 2,
        borderColor: '#1a2342',
    },
    spinButtonDisabled: {
        opacity: 0.6,
    },
    spinButtonText: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    expandingCircle: {
        position: 'absolute',
        width: WHEEL_SIZE * 3,
        height: WHEEL_SIZE * 3,
        borderRadius: WHEEL_SIZE * 1.5,
        alignSelf: 'center',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandingItemContainer: {
        alignItems: 'center',
    },
    selectedItemText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    selectedImage: {
        width: 300,
        height: 300,
    },
});