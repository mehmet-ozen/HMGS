import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { version } from '../../package.json';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import images from '../data/images';
import { Avatar } from '../components/Avatar';

const SettingItem = ({ icon, title, subtitle, onPress, value, type = 'arrow' }) => (
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={onPress}
  >
    <View style={styles.settingItemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.settingItemContent}>
        <Text style={styles.settingItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {type === 'arrow' && (
      <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
    )}
    {type === 'switch' && (
      <Switch
        value={value}
        onValueChange={onPress}
        trackColor={{ false: colors.border.light, true: colors.primary }}
        thumbColor={Platform.OS === 'ios' ? '#fff' : value ? colors.primary : '#f4f3f4'}
      />
    )}
  </TouchableOpacity>
);

const SettingsSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

export default function SettingsScreen() {
  const navigation = useNavigation();
  const {user, logout} = useAuth();
  const [notifications, setNotifications] = useState({
    all: true,
    reminders: true,
    updates: true,
  });
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout()
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Hesabı Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              navigation.navigate('Reauthenticate')
            } catch (error) {
              console.log(error);
              Alert.alert('Hata', 'Hesap silinirken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profil Bölümü */}
        <View style={styles.profileSection}>
            <View style={styles.profilePhotoContainer}>
                {/* <Image source={images.avatars[user.avatar.photoIndex]} style={styles.profilePhoto} /> */}
                <Avatar user={user}/>
            </View>
          <Text style={styles.profileName}>{user?.fullName || 'Kullanıcı'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        {/* Hesap Ayarları */}
        <SettingsSection title="Hesap">
          <SettingItem
            icon="person-outline"
            title="Profil Bilgileri"
            subtitle="Ad, soyad ve profil fotoğrafı"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Şifre Değiştir"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <SettingItem
            icon="mail-outline"
            title="E-posta Değiştir"
            onPress={() => navigation.navigate('ChangeEmail')}
          />
        </SettingsSection>

        {/* Bildirim Ayarları */}
        <SettingsSection title="Bildirimler">
          <SettingItem
            icon="notifications-outline"
            title="Tüm Bildirimler"
            type="switch"
            value={notifications.all}
            onPress={() => setNotifications(prev => ({ ...prev, all: !prev.all }))}
          />
          <SettingItem
            icon="alarm-outline"
            title="Hatırlatıcılar"
            type="switch"
            value={notifications.reminders}
            onPress={() => setNotifications(prev => ({ ...prev, reminders: !prev.reminders }))}
          />
          <SettingItem
            icon="refresh-outline"
            title="Güncellemeler"
            type="switch"
            value={notifications.updates}
            onPress={() => setNotifications(prev => ({ ...prev, updates: !prev.updates }))}
          />
        </SettingsSection>

        {/* Görünüm Ayarları */}
        <SettingsSection title="Görünüm">
          <SettingItem
            icon="moon-outline"
            title="Karanlık Mod"
            type="switch"
            value={darkMode}
            onPress={() => setDarkMode(!darkMode)}
          />
        </SettingsSection>

        {/* Yardım ve Destek */}
        <SettingsSection title="Yardım ve Destek">
          <SettingItem
            icon="help-circle-outline"
            title="Sıkça Sorulan Sorular"
            onPress={() => navigation.navigate('FAQ')}
          />
          <SettingItem
            icon="chatbubble-outline"
            title="Destek Talebi Oluştur"
            onPress={() => navigation.navigate('Support')}
          />
        </SettingsSection>

        {/* Uygulama Bilgileri */}
        <SettingsSection title="Uygulama">
          <SettingItem
            icon="information-circle-outline"
            title="Hakkında"
            subtitle={`Versiyon ${version}`}
            onPress={() => navigation.navigate('About')}
          />
        </SettingsSection>

        {/* Hesap İşlemleri */}
        <SettingsSection title="Hesap İşlemleri">
          <SettingItem
            icon="log-out-outline"
            title="Çıkış Yap"
            onPress={handleLogout}
          />
          <SettingItem
            icon="trash-outline"
            title="Hesabı Sil"
            onPress={handleDeleteAccount}
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  profilePhotoContainer: {
    borderRadius: 50,
    marginBottom: 15,
    position: 'relative',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profilePhotoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoPlaceholderText: {
    fontSize: 36,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.light,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.light,
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 13,
    color: colors.text.light,
  },
});