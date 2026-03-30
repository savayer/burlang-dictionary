import React from 'react';
import { Pressable, Text, View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import getShadow from '../utils/getShadow';
import classNames from '../utils/classNames';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ScreenHeader({
  title,
  titleClassName,
  showBackButton = true,
  style,
  children,
}) {
  const navigation = useNavigation();

  return (
    <View
      className="h-14 px-4 w-full bg-white items-center flex-row mb-4"
      style={[getShadow(5), style]}
    >
      {showBackButton && (
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#525252" />
        </Pressable>
      )}

      <Text
        className={classNames(
          'font-bold text-lg text-neutral-600',
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
