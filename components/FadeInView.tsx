import React, { ReactNode, useRef } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface FadeInViewProps {
  children: ReactNode;
}

const FadeInView = ({ children }: FadeInViewProps) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useFocusEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    };
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnimation,
      }}
    >
      {children}
    </Animated.View>
  );
};

export default FadeInView;
