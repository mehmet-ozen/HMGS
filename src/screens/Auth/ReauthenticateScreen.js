import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import firestore from "@react-native-firebase/firestore";
import { colors } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth'
export default function ReauthenticateScreen() {
    const user = auth().currentUser;
    const {deleteAccount} = useAuth();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const insets = useSafeAreaInsets();
    // const navigation = useNavigation();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!formData.password || !formData.confirmPassword) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Hata', 'Şifreler eşleşmiyor');
            return false;
        }

        return true;
    };

    const handleDeleteAccount = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const credential = auth.EmailAuthProvider.credential(
                user.email, 
                formData.password
            );
            
            await user.reauthenticateWithCredential(credential)
                .then(() => {
                    console.log("Yeniden kimlik doğrulama başarılı!");
                    // Hesap silme işlemi burada yapılacak
                    // user.delete()
                    //     .then(() => {
                    //         console.log("Hesap başarıyla silindi");
                    //         // Kullanıcıyı login ekranına yönlendir
                    //         navigation.navigate('Login');
                    //     })
                    //     .catch((error) => {
                    //         console.error("Hesap silme hatası:", error);
                    //         Alert.alert('Hata', 'Hesap silinirken bir hata oluştu');
                    //     });
                    deleteAccount();
                })
                .catch((error) => {
                    console.error("Yeniden kimlik doğrulama hatası:", error);
                    if (error.code === 'auth/invalid-credential') {
                        Alert.alert('Hata', 'Girdiğiniz şifre yanlış');
                    } else {
                        // Alert.alert('Hata', 'Kimlik doğrulama sırasında bir hata oluştu');
                    }
                });

        } catch (error) {
            console.log(error);
            Alert.alert('Hata', 'Beklenmeyen bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container,
        {
            paddingRight: insets.right,
            paddingLeft: insets.left,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }
        ]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View
                    style={styles.form}
                >
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.text.light} />
                        <TextInput
                            style={styles.input}
                            placeholder="Şifre"
                            value={formData.password}
                            onChangeText={(value) => handleInputChange('password', value)}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color={colors.text.light}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.text.light} />
                        <TextInput
                            style={styles.input}
                            placeholder="Şifre Tekrar"
                            value={formData.confirmPassword}
                            onChangeText={(value) => handleInputChange('confirmPassword', value)}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color={colors.text.light}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.deleteAccountButton}
                        onPress={handleDeleteAccount}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.text.white} />
                        ) : (
                            <Text style={styles.deleteAccountButtonText}>Hesabı Sil</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        padding: 20,
    },

    form: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.card,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        marginLeft: 10,
        color: colors.text.primary,
    },
    eyeIcon: {
        padding: 5,
    },

    deleteAccountButtonText: {
        color: colors.text.white,
        fontSize: 16,
        fontWeight: '600',
    },
    deleteAccountButton: {
        backgroundColor: colors.status.error,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
    }
});
