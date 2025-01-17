import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedReaction,
  useDerivedValue,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import SlideModal from '../../components/SlideModal';
import { Pressable } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { RichText, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import WebView from 'react-native-webview';
import contents from '../../data/noteContents.json';
import { PageIndicator } from 'react-native-page-indicator';

const { width, height } = Dimensions.get('window');
// Örnek not verileri



const NoteCard = React.memo(({ content, onEdit }) => (
  <Animated.View style={styles.noteCard}>
    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
      <Ionicons name="pencil" size={20} color={colors.primary} />
    </TouchableOpacity>

    <WebView
      linkText={true}
      allowsLinkPreview={true}
      showsVerticalScrollIndicator={false}

      source={{
        html: `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, system-ui;
                line-height: 1.4;
                color: #2C3E50;
                padding: 16px;
                margin: 0;
              }
              h1 {
                font-size: 26px;
                color: ${colors.primary};
                margin-bottom: 25px;
                font-weight: 700;
              }
              h2 {
                font-size: 22px;
                color: #34495E;
                margin-top: 28px;
                font-weight: 600;
              }
              p {
                font-size: 18px;
                margin-bottom: 16px;
                color: #2C3E50;
              }
              ul {
                padding-left: 20px;
                margin-bottom: 20px;
              }
              li {
                font-size: 18px;
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
  const isOpen = useSharedValue(0);
  const toggleSheet = useCallback(() => {
    isOpen.value = isOpen.value === 0 ? 1 : 0;
  }, []);

  const [editingNote, setEditingNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const isEditModalOpen = useSharedValue(0);

  useEffect(() => {
    if (topic?.contentId) {
      const content = contents.contents.find(c => c.id === topic.contentId);
      if (content && content.items) {
        setNotes(content.items);
      }
    }
  }, [topic]);

  const editor = useEditorBridge({
    autoFocus: true,

  });
  const editedContent = useEditorContent(editor, { type: 'html' });

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
      });
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
    } catch (error) {
      console.warn('Scroll error:', error);
      // Hata durumunda alternatif scroll
      flatListRef.current?.scrollToOffset({
        offset: newPage * width,
        animated: true
      });
      setCurrentPage(newPage);
    }
  }, [notes.length, width]);

  const handleExit = useCallback(() => {
    toggleSheet();
    navigation.goBack();
  }, [navigation]);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'black'} style="auto" />

      <View style={styles.pageIndicatorContainer}>
        <PageIndicator
          current={currentPage}
          count={notes.length}
          color={colors.primary}
          size={8}
          variant='beads'
        />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
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
    width: width,
    height: height,
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
  },
  pageIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});