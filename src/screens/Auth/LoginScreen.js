import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';


export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    // // Email/Şifre ile giriş
    const handleEmailLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen email ve şifre giriniz');
            return;
        }
        try {
            setLoading(true);
            await login(email, password);

        } catch (error) {
            Alert.alert('Hata', 'Giriş yaparken bir hata oluştu');
            console.log(error)
        }finally{
            setLoading(false);
        }
    };
    const handleGoogleLogin = () => {

    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        style={styles.header}
                    >
                        <Image
                            source={require('../../../assets/images/pp_1.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Hoş Geldiniz</Text>
                        <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        style={styles.form}
                    >
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={colors.text.light} />
                            <TextInput
                                style={styles.input}
                                placeholder="E-posta"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.text.light} />
                            <TextInput
                                style={styles.input}
                                placeholder="Şifre"
                                value={password}
                                onChangeText={setPassword}
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

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            style={styles.forgotPassword}
                        >
                            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleEmailLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.text.white} />
                            ) : (
                                <Text style={styles.loginButtonText}>Giriş Yap</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(600).duration(1000).springify()}
                        style={styles.footer}
                    >
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>veya</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={handleGoogleLogin}
                            disabled={loading}
                        >
                            <Image
                                source={require('../../../assets/images/google.png')}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleButtonText}>Google ile devam et</Text>
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Hesabınız yok mu? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.registerLink}>Kayıt Ol</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.light,
        marginBottom: 30,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    loginButtonText: {
        color: colors.text.white,
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        marginTop: 'auto',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border.light,
    },
    dividerText: {
        marginHorizontal: 10,
        color: colors.text.light,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.card,
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleButtonText: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        color: colors.text.light,
    },
    registerLink: {
        color: colors.primary,
        fontWeight: '600',
    },
});
