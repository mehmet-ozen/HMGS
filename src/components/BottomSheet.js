import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

// const { height: SCREEN_HEIGHT } = useWindowDimensions();

export default function BottomSheet({ isOpen, toggleSheet, duration = 500, children }) {
  const height = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withSpring(isOpen.value ? 0 : 1, {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    })
  );
  // const progress = useDerivedValue(() =>
  //   withTiming(isOpen.value ? 0 : 1 * { duration })
  // );
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * height.value }],
    opacity: withTiming(isOpen.value ? 1 : 0, { duration: duration / 4 }),
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen.value ? 1 : 0, { duration: duration / 4 }),
    zIndex: isOpen.value ? 1 : -1,
  }));

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable 
          style={styles.flex} 
          onPress={toggleSheet}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[styles.sheet, sheetStyle]}>
        {children}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  sheet: {
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.background.card,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
    overflow: 'hidden',
  },
});
