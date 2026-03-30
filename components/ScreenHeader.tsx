import React, { ReactNode } from 'react';
import { Pressable, Text, View, ViewStyle, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { twMerge } from 'tailwind-merge';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ScreenHeaderProps {
  title: string;
  titleClassName?: string;
  showBackButton?: boolean;
  style?: ViewStyle;
  children?: ReactNode;
}

export default function ScreenHeader({
  title,
  titleClassName,
  showBackButton = true,
  style,
  children,
}: ScreenHeaderProps) {
  const navigation = useNavigation();

  return (
    <View
      className="h-14 px-4 w-full bg-white items-center flex-row border-b border-neutral-100"
      style={style}
    >
      {showBackButton && (
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#0036a7" />
        </Pressable>
      )}

      <Text
        className={twMerge(
          'font-bold text-lg text-bur-blue',
          titleClassName,
        )}
        style={{
          maxWidth: width - 100,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>

      {children}
    </View>
  );
}
