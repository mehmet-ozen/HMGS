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
          setUser({ ...user, ...userDoc.data() });
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
      const userRef = firestore().collection('users').doc(auth().currentUser.uid);
      if(userRef){
        await userRef.delete();
      }
      await auth().currentUser.delete();
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  const register = async (email, password, fullName) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userData = {
        fullName,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastLogin: null,
        profilePhotoIndex: 0,
      };
  
      // Kullanıcı bilgilerini Firestore'a kaydet
      await firestore().collection('users').doc(userCredential.user.uid).set(userData);
  
      // AuthContext'teki user state'ini güncelle
      setUser({ ...userCredential.user, ...userData });
    } catch (error) {
      throw error;
    }
  };

  const updateUserData = async (userData, fullName, profilePhotoIndex) => {
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
        profilePhotoIndex: profilePhotoIndex,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
      setUser({ ...user, fullName: fullName.trim(), profilePhotoIndex: profilePhotoIndex, updateAt: firestore.FieldValue.serverTimestamp() })
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }

  }

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
        deleteAccount
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