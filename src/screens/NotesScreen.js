import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
    useAnimatedRef,
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    LinearTransition,
    scrollTo,
    interpolate
} from 'react-native-reanimated';

import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function NotesScreen({ route }) {
    const navigation = useNavigation();
    const { topic } = route.params;
    const flatListRef = useRef();
    const [currentPage, setCurrentPage] = useState(0);
    const progressAnimation = useSharedValue(0);
    const pageCounterAnimation = useSharedValue(0);
    const progressContainerWidth = width - 32;

    useEffect(() => {
        navigation.setOptions({
          title: topic.title,
        });
      }, [topic]);

    // Örnek not verileri
    const notes = [
        {
            id: '1',
            title: 'Giriş',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
            id: '2',
            title: 'Temel Kavramlar',
            content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
            id: '3',
            title: 'Önemli Noktalar',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            id: '4',
            title: 'Önemli Noktalar',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            id: '5',
            title: 'Önemli Noktalar',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            id: '6',
            title: 'Önemli Noktalar',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },



    ];

    const renderNoteCard = ({ item, index }) => (
        <Animated.View
            layout={LinearTransition}
            style={styles.noteCard}
        >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteContent}>{item.content}</Text>
        </Animated.View>
    );

    const onScroll = (event) => {
        const page = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentPage(page);
        progressAnimation.value = withSpring(
            ((page + 1) / notes.length) * 100,
            {
                damping: 15,
                stiffness: 100,
            }
        );
        pageCounterAnimation.value = withSpring(
            (page + 1) / notes.length * 100,
            {
                damping: 15,
                stiffness: 100,
            }
        );
    };

    const progressAnimatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progressAnimation.value}%`,
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 2,
        };
    });

    const pageCounterStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        pageCounterAnimation.value,
                        [0, 100],
                        [0, progressContainerWidth - 40]
                    ),
                }
            ],
        };
    });

    const goToNextPage = () => {
        if (currentPage < notes.length - 1) {
            const nextPage = currentPage + 1;
            flatListRef.current?.scrollToIndex({
                index: nextPage,
                animated: true
            });
            setCurrentPage(nextPage);
            progressAnimation.value = withSpring(
                ((nextPage + 1) / notes.length) * 100,
                {
                    damping: 15,
                    stiffness: 100,
                }
            );
            pageCounterAnimation.value = withSpring(
                (nextPage + 1) / notes.length * 100,
                {
                    damping: 15,
                    stiffness: 100,
                }
            );
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 0) {
            const prevPage = currentPage - 1;
            flatListRef.current?.scrollToIndex({
                index: prevPage,
                animated: true
            });
            setCurrentPage(prevPage);
            progressAnimation.value = withSpring(
                ((prevPage + 1) / notes.length) * 100,
                {
                    damping: 15,
                    stiffness: 100,
                }
            );
            pageCounterAnimation.value = withSpring(
                (prevPage + 1) / notes.length * 100,
                {
                    damping: 15,
                    stiffness: 100,
                }
            );
        }
    };

    const getItemLayout = (data, index) => ({
        length: width,
        offset: width * index,
        index,
    });

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentPage(viewableItems[0].index);
        }
    }).current;

    const onMomentumScrollEnd = (event) => {
        const page = Math.round(event.nativeEvent.contentOffset.x / width);
        if (Math.abs(page - currentPage) > 1) {
            const targetPage = currentPage + (page > currentPage ? 1 : -1);
            flatListRef.current?.scrollToIndex({
                index: targetPage,
                animated: true
            });
            setCurrentPage(targetPage);
        } else {
            setCurrentPage(page);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <View style={styles.counterContainer}>
                        <Animated.Text style={[styles.pageCounter, pageCounterStyle]}>
                            {currentPage + 1}
                        </Animated.Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <Animated.View style={progressAnimatedStyle} />
                    </View>
                </View>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={notes}
                renderItem={renderNoteCard}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                onMomentumScrollEnd={onMomentumScrollEnd}
                scrollEventThrottle={16}
                snapToAlignment="center"
                snapToInterval={width}
                decelerationRate={'normal'}
                style={{flexGrow: 0, height: height * 0.8}}
                itemLayoutAnimation={LinearTransition}
                getItemLayout={getItemLayout}
                initialScrollIndex={0}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 10,
                }}
            />

            <View style={styles.navigationButtons}>
                <TouchableOpacity
                    style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
                    onPress={goToPrevPage}
                    disabled={currentPage === 0}
                >
                    <Ionicons name="chevron-back" size={24} color={currentPage === 0 ? colors.text.light : colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, currentPage === notes.length - 1 && styles.navButtonDisabled]}
                    onPress={goToNextPage}
                    disabled={currentPage === notes.length - 1}
                >
                    <Ionicons name="chevron-forward" size={24} color={currentPage === notes.length - 1 ? colors.text.light : colors.primary} />
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
    header: {
        paddingHorizontal: 16,
    },
    progressContainer: {
        marginTop: 8,
    },
    counterContainer: {
        marginBottom: 8,
        overflow: 'hidden',
    },
    pageCounter: {
        fontSize: 16,
        color: colors.text.white,
        width: 30,
        textAlign: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 15,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: colors.background.secondary,
        borderRadius: 2,
        overflow: 'hidden',
    },
    noteCard: {
        width: width - 32,
        margin: 16,
        backgroundColor: colors.background.secondary,
        borderRadius: 16,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    noteTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 16,
    },
    noteContent: {
        fontSize: 16,
        lineHeight: 24,
        color: colors.text.primary,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    navButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: colors.background.secondary,
    },
    navButtonDisabled: {
        opacity: 0.5,
    }

});