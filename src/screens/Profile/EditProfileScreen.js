import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = width * 0.25;
const GRID_SPACING = 10;
const ITEMS_PER_ROW = 3;
const ITEM_SIZE = (width - 40 - (ITEMS_PER_ROW - 1) * GRID_SPACING) / ITEMS_PER_ROW;

const PROFILE_PHOTOS = [
    { id: 0, source: require('../../../assets/images/pp_0.png'), locked: false, price: 0 },
    { id: 1, source: require('../../../assets/images/pp_1.png'), locked: false, price: 0 },
    { id: 2, source: require('../../../assets/images/pp_2.png'), locked: false, price: 0 },
    { id: 3, source: require('../../../assets/images/pp_3.png'), locked: false, price: 0 },
    { id: 4, source: require('../../../assets/images/pp_4.png'), locked: false, price: 0 },
    { id: 5, source: require('../../../assets/images/pp_5.png'), locked: true, price: 100 },
    { id: 6, source: require('../../../assets/images/pp_6.png'), locked: true, price: 100 },
    { id: 7, source: require('../../../assets/images/pp_7.png'), locked: true, price: 100 },
    { id: 8, source: require('../../../assets/images/pp_8.png'), locked: true, price: 100 },
    { id: 9, source: require('../../../assets/images/pp_9.png'), locked: true, price: 100 }
];

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [loading, setLoading] = useState(false);
    const {user, updateUserData} = useAuth();
    useEffect(() => {
        if(user){
            setFullName(user.fullName || '');
            setSelectedPhoto(user.avatar.photoIndex);
        }
    }, []);

    const handlePhotoSelect = (index) => {
        if (PROFILE_PHOTOS[index].locked) {
            Alert.alert(
                'Premium Fotoğraf',
                `Bu profil fotoğrafını kullanmak için ${PROFILE_PHOTOS[index].price} puan gerekiyor. Satın almak ister misiniz?`,
                [
                    { text: 'İptal', style: 'cancel' },
                    {
                        text: 'Satın Al',
                        onPress: () => handlePurchasePhoto(index)
                    }
                ]
            );
            return;
        }
        setSelectedPhoto(index);
    };

    const handlePurchasePhoto = async (index) => {
        try {
            const userDoc = await firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .get();

            const userData = userDoc.data();
            const currentPoints = userData.points || 0;
            const photoPrice = PROFILE_PHOTOS[index].price;

            if (currentPoints < photoPrice) {
                Alert.alert('Yetersiz Puan', 'Bu fotoğrafı satın almak için yeterli puanınız yok.');
                return;
            }

            await firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .update({
                    points: currentPoints - photoPrice,
                    unlockedPhotos: firestore.FieldValue.arrayUnion(index)
                });

            setSelectedPhoto(index);
            Alert.alert('Başarılı', 'Profil fotoğrafı başarıyla satın alındı!');

        } catch (error) {
            Alert.alert('Hata', 'Satın alma işlemi sırasında bir hata oluştu.');
        }
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Hata', 'Lütfen adınızı giriniz');
            return;
        }
        updateUserData(user, fullName, selectedPhoto)
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Profil Önizleme */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(1000).springify()}
                    style={styles.previewSection}
                >
                    <Image
                        source={PROFILE_PHOTOS[selectedPhoto].source}
                        style={styles.previewPhoto}
                    />
                    <Text style={styles.previewName}>{fullName || 'İsim Giriniz'}</Text>
                </Animated.View>

                {/* İsim Düzenleme */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(1000).springify()}
                    style={styles.inputSection}
                >
                    <Text style={styles.inputLabel}>Ad Soyad</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color={colors.text.light} />
                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Adınızı giriniz"
                            placeholderTextColor={colors.text.light}
                        />
                    </View>
                </Animated.View>

                {/* Profil Fotoğrafları Grid */}
                <Animated.View
                    entering={FadeInDown.delay(600).duration(1000).springify()}
                    style={styles.photosSection}
                >
                    <Text style={styles.sectionTitle}>Profil Fotoğrafı Seçin</Text>
                    <View style={styles.photosGrid}>
                        {PROFILE_PHOTOS.map((photo, index) => (
                            <TouchableOpacity
                                key={photo.id}
                                style={[
                                    styles.photoItem,
                                    selectedPhoto === index && styles.selectedPhotoItem
                                ]}
                                onPress={() => handlePhotoSelect(index)}
                            >
                                <Image source={photo.source} style={styles.photoImage} />
                                {photo.locked && (
                                    <View style={styles.lockedOverlay}>
                                        <Ionicons name="lock-closed" size={20} color={colors.text.white} />
                                        <Text style={styles.priceText}>{photo.price}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Kaydet Butonu */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    previewSection: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    previewPhoto: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        marginBottom: 10,
    },
    previewName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    inputSection: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.light,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.card,
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        marginLeft: 10,
        color: colors.text.primary,
        fontSize: 16,
    },
    photosSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.light,
        marginBottom: 15,
    },
    photosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GRID_SPACING,
    },
    photoItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white',
    },
    selectedPhotoItem: {
        borderColor: colors.primary,
    },
    photoImage: {
        width: '100%',
        height: '100%',
    },
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceText: {
        color: colors.text.white,
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        color: colors.text.white,
        fontSize: 16,
        fontWeight: '600',
    },
}); 