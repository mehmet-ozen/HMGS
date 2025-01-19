import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React from 'react'
import images from '../data/images'
import { colors } from '../theme/colors';

/**
 * @typedef {Object} AvatarProps
 * @property {import('react-native').StyleProp<import('react-native').ViewStyle} style - Stil özellikleri
 * @property {import('react-native').ImageProps} imageSrc - Avatar fotoğraf kaynağı
 * @property {number} profilePhotoIndex - Avatar fotoğraf indeksi
 * @property {'small' | 'medium' | 'large'} size - Avatar boyutu
 */

/**
 * @param {AvatarProps} props
 */
const { width, height } = Dimensions.get('window');

const frameColors = [
    '#FFD700', // Altın Sarısı
    '#C0C0C0', // Gümüş
    '#CD7F32', // Bronz
    '#4169E1', // Kraliyet Mavisi
    '#50C878', // Zümrüt Yeşili
    '#E0115F', // Yakut Kırmızısı
    '#8A2BE2', // Mor
    '#FF8C00', // Turuncu
    '#000000', // Siyah
    '#FFFFFF', // Beyaz
];

export const Avatar = ({ user, size = 'medium', style  }) => {
    const getSize = () => {
        switch (size) {
            case 'small':
                return {
                    width: height <= 720 ? width * 0.15 : width * 0.15,
                    height: height <= 720 ? width * 0.15 : width * 0.15,
                };
            case 'large':
                return {
                    width: height <= 720 ? width * 0.3 : width * 0.35,
                    height: height <= 720 ? width * 0.3 : width * 0.35,
                };
            case 'medium':
            default:
                return {
                    width: height <= 720 ? width * 0.2 : width * 0.25,
                    height: height <= 720 ? width * 0.2 : width * 0.25,
                };
        }
    };

    if (!user) {
        console.log(user);
        return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        );
    }

    return (
        <View style={style}>
            <Image
                source={images.avatars[user.avatar.photoIndex]}
                style={[
                    styles.avatar,
                    getSize(),
                    {
                        borderColor:frameColors[0]
                    }
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 999,
        backgroundColor: colors.background.primary,
        borderWidth: 2,
    }
});