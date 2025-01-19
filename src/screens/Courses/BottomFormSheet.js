import { View, Text, StyleSheet, Image, Vibration, Dimensions } from 'react-native'
import React from 'react'
import { colors } from '../../theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


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
const {width, height} = Dimensions.get('window');

export default function BottomFormSheet({ route }) {
    const navigation = useNavigation();
    const { course } = route.params;

    const handleNotePress = () => {
        Vibration.vibrate(50);
        navigation.replace("CoursesDetail", { course: course });
    };

    const handleQuizPress = () => {
        Vibration.vibrate(50);
        navigation.replace("QuizTopics", { course: course });
    };
    return (
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Image
                        source={courseImages[course?.image]}
                        style={styles.modalImage}
                    />
                    <View style={styles.modalTitleContainer}>
                        <Text style={styles.modalTitle} numberOfLines={2}>
                            {course?.title}
                        </Text>
                        <View style={styles.modalStats}>
                            <View style={styles.modalStatItem}>
                                <View style={styles.modalStatIconContainer}>
                                    <Ionicons name="book-outline" size={14} color={colors.primary} />
                                </View>
                                <Text style={styles.modalStatText}>12 Konu</Text>
                            </View>
                            <View style={styles.modalStatItem}>
                                <View style={styles.modalStatIconContainer}>
                                    <Ionicons name="time-outline" size={14} color={colors.primary} />
                                </View>
                                <Text style={styles.modalStatText}>2 Saat</Text>
                            </View>
                            <View style={styles.modalStatItem}>
                                <View style={styles.modalStatIconContainer}>
                                    <Ionicons name="help-circle-outline" size={14} color={colors.primary} />
                                </View>
                                <Text style={styles.modalStatText}>25 Soru</Text>
                            </View>
                        </View>
                    </View>
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
                        <View style={styles.modalButtonIconContainer}>
                            <Ionicons name="book" size={24} color={colors.text.white} />
                        </View>
                        <View style={styles.modalButtonTextContainer}>
                            <Text style={styles.modalButtonText}>Not Oku</Text>
                            <Text style={styles.modalButtonSubText}>Konuları incele</Text>
                        </View>
                        <View style={styles.modalButtonArrow}>
                            <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
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
                        <View style={[styles.modalButtonIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <Ionicons name="help-circle" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.modalButtonTextContainer}>
                            <Text style={[styles.modalButtonText, { color: colors.primary }]}>
                                Soru Çöz
                            </Text>
                            <Text style={[styles.modalButtonSubText, { color: colors.text.secondary }]}>
                                25 soru mevcut
                            </Text>
                        </View>
                        <View style={[styles.modalButtonArrow, { backgroundColor: `${colors.primary}10` }]}>
                            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
                        </View>
                    </Pressable>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.background.card,
        height: '100%',
        padding: 16
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

    modalHeader: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    modalImage: {
        width: height <= 720? 75: 100,
        height: height <= 720? 75: 100,
        borderRadius: 16,
        backgroundColor: colors.background.secondary,
    },
    modalTitleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 12,
    },
    modalStats: {
        flexDirection: 'row',
        gap: 16,
    },
    modalStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    modalStatIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: `${colors.primary}20`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalStatText: {
        fontSize: 10,
        color: colors.text.secondary,
    },
    modalButtons: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
    },
    modalButton: {
        alignItems: 'center',
        padding: height <= 720? 8: 16,
        borderRadius: 16,
        width: '100%',
        gap: 12,
        flexDirection: 'row',
    },
    modalButtonPrimary: {
        backgroundColor: colors.primary,
    },
    modalButtonSecondary: {
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    modalButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    modalButtonIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: `${colors.text.white}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonTextContainer: {
        flex: 1,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.white,
        marginBottom: 2,
    },
    modalButtonSubText: {
        fontSize: 13,
        color: `${colors.text.white}80`,
    },
    modalButtonArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: `${colors.text.white}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
