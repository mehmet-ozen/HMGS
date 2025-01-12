import React from 'react';
import {
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
} from 'react-native-reanimated';


export default function BottomSheet({ isOpen, toggleSheet, duration = 500, children }) {
  const height = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * height.value }],
  }));
  const backgroundColorSheetStyle = {
    backgroundColor: '#f8f9ff'
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      {/* <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={sheetStyles.flex} onPress={()=> {
          toggleSheet();
        }} />
      </Animated.View> */}
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[sheetStyles.sheet,backgroundColorSheetStyle,sheetStyle]}>
        <Text>
          asdiofhasifdsdafdaadsafsadfasdf
        </Text>
      </Animated.View>
    </>
  );
}

const sheetStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  sheet: {
    padding: 16,
    paddingRight: '2rem',
    paddingLeft: '2rem',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
    justifyContent: 'center',
    height: 100,
  },
  backdrop: Object.assign(Object.assign({}, StyleSheet.absoluteFillObject), {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  }),
});