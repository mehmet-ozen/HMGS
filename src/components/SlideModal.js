import React from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

export default function SlideModal({ 
  isOpen, 
  toggleModal, 
  duration = 300, 
  children, 
  speed = 10,
}) {
  const { height: windowHeight } = useWindowDimensions();
  const height = useSharedValue(0);
  
  const contentHeight = useDerivedValue(() => {
    return windowHeight/2 - height.value;
  });

  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1 * speed, { duration })
  );

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (progress.value * height.value) + contentHeight.value }],
    opacity: withTiming(isOpen.value ? 1 : 0, { duration }),
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen.value ? 1 : 0, { duration }),
    zIndex: isOpen.value ? 1 : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flex} onPress={toggleModal} />
      </Animated.View>

      <Animated.View
        style={[styles.modal, modalStyle]}
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  modal: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    padding: 20,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 