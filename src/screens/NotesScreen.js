import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, ScrollView, Button, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  LinearTransition,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SlideModal from '../components/SlideModal';
import { Pressable, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { HighlightBridge, LinkBridge, RichText, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');
// Örnek not verileri
const notesData = [
  {
    id: '1',
    title: 'Giriş',
    content: `
      <h1>Hukuk Nedir?</h1>
      <p>Hukuk, toplumsal yaşamı düzenleyen ve uyulması devlet gücüyle desteklenmiş kurallar bütünüdür.</p>
      <h2>Hukukun Temel İlkeleri</h2>
      <ul>
        <li>Adalet</li>
        <li>Eşitlik</li>
        <li>Tarafsızlık</li>
      </ul>
    `
  },
  {
    id: '2',
    title: 'Temel Kavramlar',
    content: `
      <h1>Hukukun Kaynakları</h1>
      <p>Hukukun kaynakları asli kaynaklar ve yardımcı kaynaklar olarak ikiye ayrılır.</p>
      <h2>Asli Kaynaklar</h2>
      <ul>
        <li>Anayasa</li>
        <li>Kanun</li>
        <li>Uluslararası Antlaşmalar</li>
      </ul>
    `
  },
  {
    id: '3',
    title: 'Önemli Noktalar',
    content: `
      <h1>Hak ve Borç Kavramları</h1>
      <p>Hak, hukuk düzeninin kişilere tanıdığı yetkilerdir.</p>
      <h2>Hak Türleri</h2>
      <ul>
        <li>Kamu Hakları</li>
        <li>Özel Haklar</li>
      </ul>
    `
  },
  {
    id: '4',
    title: 'Hukuk Sistemleri',
    content: `
      <h1>Dünya Hukuk Sistemleri</h1>
      <p>Dünyada başlıca üç hukuk sistemi vardır:</p>
      <ul>
        <li>Kıta Avrupası Hukuk Sistemi</li>
        <li>Anglo-Sakson Hukuk Sistemi</li>
        <li>İslam Hukuk Sistemi</li>
      </ul>
    `
  },
  {
    id: '5',
    title: 'Yargı Sistemi',
    content: `
      <h1>Türk Yargı Sistemi</h1>
      <p>Türk yargı sistemi üç ana dala ayrılır:</p>
      <ul>
        <li>Adli Yargı</li>
        <li>İdari Yargı</li>
        <li>Anayasa Yargısı</li>
      </ul>
    `
  },
  {
    id: '6',
    title: 'Hukuk Dalları',
    content: `
      <h1>Temel Hukuk Dalları</h1>
      <p>Hukuk çeşitli dallara ayrılır:</p>
      <ul>
        <li>Kamu Hukuku</li>
        <li>Özel Hukuk</li>
        <li>Karma Hukuk Dalları</li>
      </ul>
    `
  }
];

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 100,
  mass: 0.5,
};

const NoteCard = React.memo(({ content, onEdit }) => (
  <Animated.View style={styles.noteCard}>
    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
      <Ionicons name="pencil" size={20} color={colors.primary} />
    </TouchableOpacity>
    
    <WebView
    linkText={true}
    allowsLinkPreview={true}
    showsVerticalScrollIndicator={false}
    
      source={{ html: `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, system-ui;
                line-height: 1.8;
                color: #2C3E50;
                padding: 16px;
                margin: 0;
              }
              h1 {
                font-size: 26px;
                color: ${colors.primary};
                margin-bottom: 20px;
                font-weight: 700;
              }
              h2 {
                font-size: 22px;
                color: #34495E;
                margin-top: 28px;
                font-weight: 600;
              }
              p {
                font-size: 16px;
                margin-bottom: 16px;
                color: #2C3E50;
              }
              ul {
                padding-left: 20px;
                margin-bottom: 20px;
              }
              li {
                margin-bottom: 12px;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `}}
      scalesPageToFit={false}
      style={styles.webView}
    />
  </Animated.View>
));



const NavigationButton = React.memo(({ onPress, disabled, icon, title }) => (
  <TouchableOpacity
    style={[styles.navButton, disabled && styles.navButtonDisabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.navButtonContent}>
      {icon === "chevron-back" && (
        <Ionicons
          name={icon}
          size={24}
          color={disabled ? colors.text.light : colors.primary}
        />
      )}
      <Text style={[
        styles.navButtonText,
        disabled && styles.navButtonTextDisabled
      ]}>
        {title}
      </Text>
      {icon === "chevron-forward" && (
        <Ionicons
          name={icon}
          size={24}
          color={disabled ? colors.text.light : colors.primary}
        />
      )}
    </View>
  </TouchableOpacity>
));

export default function NotesScreen({ route }) {
  const { topic } = route.params;
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const progressAnimation = useSharedValue(0);

  const isOpen = useSharedValue(0);
  const toggleSheet = useCallback(() => {
    isOpen.value = isOpen.value === 0 ? 1 : 0;
  }, []);

  const [editingNote, setEditingNote] = useState(null);
  const [notes, setNotes] = useState(notesData);
  const isEditModalOpen = useSharedValue(0);

  const editor = useEditorBridge({
    autoFocus: true,

  });
  const editedContent = useEditorContent(editor, {type: 'html'});

  useEffect(() => {
    editedContent && console.log(editedContent);
  }, [editedContent]);



  const toggleEditModal = useCallback(() => {
    isEditModalOpen.value = isEditModalOpen.value === 0 ? 1 : 0;
  }, []);

  const handleEditNote = (note) => {
    setEditingNote(note);
    editor.setContent(note.content);
    toggleEditModal();
  };

  const handleSaveNote = async () => {
    if (!editingNote) return;

    const content = await editedContent;

    const updatedNote = {
      ...editingNote,
      content: content || editingNote.content
    };

    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === editingNote.id ? updatedNote : note
      )
    );
    toggleEditModal();
  };

  useEffect(() => {
    if (navigation.isFocused()) {
      navigation.setOptions({
        title: topic.title,
        headerRight: () => (
          <Pressable onPress={toggleSheet} style={styles.headerButton}>
            <View style={styles.closeButton}>
              <Ionicons 
                name="close-outline" 
                size={28} 
                color={colors.text.white} 
              />
            </View>
          </Pressable>
        )
      });
      updateProgress(0);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isOpen.value === 0) {
        e.preventDefault();
        toggleSheet();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, toggleSheet]);

  const updateProgress = (page) => {
    const progress = ((page + 1) / notes.length) * 100;
    progressAnimation.value = withSpring(progress, SPRING_CONFIG);
  };

  const changePage = useCallback((newPage) => {
    // Sınırları kontrol et
    if (newPage < 0) return; // Negatif index'e izin verme
    if (newPage >= notes.length) return; // Maksimum index'i aşmayı engelle

    try {
      flatListRef.current?.scrollToIndex({
        index: newPage,
        animated: true,
        viewPosition: 0
      });
      setCurrentPage(newPage);
      updateProgress(newPage);
    } catch (error) {
      console.warn('Scroll error:', error);
      // Hata durumunda alternatif scroll
      flatListRef.current?.scrollToOffset({
        offset: newPage * width,
        animated: true
      });
      setCurrentPage(newPage);
      updateProgress(newPage);
    }
  }, [notes.length, updateProgress, width]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnimation.value}%`,
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 8,
      position: 'absolute',
    };
  });


  const handleExit = useCallback(() => {
    navigation.goBack();
  }, [navigation]);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <View style={styles.header}>
        <View style={styles.progressWrapper}>
          <View style={styles.progressBarContainer}>
            <Animated.View style={progressStyle} />
          </View>
          <Animated.Text style={styles.progressText}>
            {`%${Math.round(((currentPage + 1) / notes.length) * 100)}`}
          </Animated.Text>
        </View>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={notes}
        renderItem={({ item }) => (
          <NoteCard
            content={item.content}
            onEdit={() => handleEditNote(item)}
          />
        )}
        windowSize={2}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        style={styles.noteList}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.navigationContainer}>
        <NavigationButton
          onPress={() => changePage(currentPage - 1)}
          disabled={currentPage === 0}
          icon="chevron-back"
          title="Önceki"
        />
        <NavigationButton
          onPress={() => changePage(currentPage + 1)}
          disabled={currentPage === notes.length - 1}
          icon="chevron-forward"
          title="Sonraki"
        />
      </View>

      <SlideModal
        isOpen={isOpen}
        toggleModal={toggleSheet}
        duration={300}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Çıkmak istediğinize emin misiniz?</Text>
          <View style={styles.modalButtons}>


            <Pressable
              style={[styles.modalButton, { backgroundColor: colors.background.primary, borderWidth: 1, borderColor: colors.primary }]}
              onPress={toggleSheet}
            >
              <Text style={[styles.modalButtonText, { color: colors.primary }]}>Hayır</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleExit}
            >
              <Text style={styles.modalButtonText}>Evet</Text>
            </Pressable>
          </View>
        </View>
      </SlideModal>

      <SlideModal
        isOpen={isEditModalOpen}
        toggleModal={toggleEditModal}
        duration={300}

      >
        <View style={styles.editModalContent}>
          <Text style={styles.editModalTitle}>Notu Düzenle</Text>
          <RichText editor={editor} style={styles.richEditor} />
          <View style={styles.editModalButtons}>
            <TouchableOpacity
              style={[styles.editModalButton, { backgroundColor: colors.status.error }]}
              onPress={toggleEditModal}
            >
              <Text style={styles.editModalButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editModalButton, { backgroundColor: colors.status.success }]}
              onPress={handleSaveNote}
            >
              <Text style={styles.editModalButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
        }}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
      </SlideModal>


    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    backgroundColor: colors.background.secondary,

  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    overflow: 'hidden',
    elevation:5,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  progressBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: `${colors.primary}30`,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 45,
  },
  noteCard: {
    width: width,
    height: height - 140, // Navigation ve progress bar için alan bırakıyoruz
    backgroundColor: colors.background.secondary,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  noteHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    marginTop: 16
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation:5,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.background.secondary,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    minWidth: 120,
  },
  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  navButtonDisabled: {
    backgroundColor: colors.background.secondary,
    opacity: 0.5,
  },
  navButtonTextDisabled: {
    color: colors.text.light,
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width:width,
    height:height,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },

  editButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editModalContent: {
    padding: 20,
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  editInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    padding: 15,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  editModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 100,
  },
  editModalButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  richEditorContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  richEditor: {
    minHeight: 150,
    backgroundColor: colors.background.secondary,
  },
  headerButton: {
    marginRight: 10,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  noteList: {
    flexGrow: 0,
  }
});