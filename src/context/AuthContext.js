import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      console.log(user);
      if (user) {
        // Kullanıcı bilgilerini Firestore'dan al
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          setUser({ ...userDoc.data() });
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [loading]);

  const login = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      // Son giriş zamanını güncelle
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .update({
          lastLogin: firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const userUid = auth().currentUser.uid;
      await auth().currentUser.delete();

      const userRef = firestore().collection('users').doc(userUid);
      if (userRef) {
        await userRef.delete();
      }
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  const register = async (email, password, fullName) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userData = {
        userId: auth().currentUser.uid,
        fullName,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastLogin: null,
        avatar: {
          photoIndex: 0,
          frameIndex: 0,
        },
      };

      // Kullanıcı bilgilerini Firestore'a kaydet
      await firestore().collection('users').doc(userCredential.user.uid).set(userData);

      // AuthContext'teki user state'ini güncelle
      setUser({ ...userData });
    } catch (error) {
      throw error;
    }
  };

  const updateUserData = async (userData, fullName, photoIndex) => {
    try {
      const userRef = firestore()
        .collection('users')
        .doc(auth().currentUser.uid);

      if (userData && userData.updatedAt) {
        // updatedAt'ı Firestore Timestamp olarak alıyoruz
        const updatedAt = userData.updatedAt.toDate();
        const now = new Date();
        const diffInTime = now - updatedAt;
        const diffInDays = diffInTime / (1000 * 3600 * 24); // milisaniye -> gün

        // Eğer son güncellemeden 3 gün geçmişse
        if (diffInDays < 0) {
          Alert.alert("Güncellemeyi 3 günden önce yapamazsınız.");
          return; // Güncelleme yapmayı engelle
        }
      }

      await userRef.update({
        fullName: fullName.trim(),
        avatar: {
          photoIndex: photoIndex,
          frameIndex: 0,
        },
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
      setUser({
        ...user,
        fullName: fullName.trim(),
        avatar: {
          photoIndex: photoIndex,
          frameIndex: 0,
        },
        updateAt: firestore.FieldValue.serverTimestamp()
      })
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }
  const addMatchsIds = async (matchId) => {
    try {
      const userRef = firestore()
        .collection('users')
        .doc(auth().currentUser.uid);

      // Önce mevcut kullanıcı verisini alalım
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      // matchIds array'ini kontrol et, yoksa oluştur
      const currentMatchIds = userData.matchIds || [];

      // Yeni matchId'yi array'e ekle (eğer zaten yoksa)
      if (!currentMatchIds.includes(matchId)) {
        const updatedMatchIds = [...currentMatchIds, matchId];

        // Firestore'u güncelle
        await userRef.update({
          matchIds: updatedMatchIds,
          updatedAt: firestore.FieldValue.serverTimestamp()
        });

        // Local state'i güncelle
        setUser(prevUser => ({
          ...prevUser,
          matchIds: updatedMatchIds
        }));

        console.log('Yeni maç ID başarıyla eklendi:', matchId);
      }

    } catch (error) {
      console.error('Maç ID eklenirken hata oluştu:', error);
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSignIn: !!user,
        login,
        logout,
        register,
        updateUserData,
        deleteAccount,
        addMatchsIds
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 