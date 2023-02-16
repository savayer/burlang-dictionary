import React from 'react';
import { View, Text } from 'react-native';

export default function Navbar({ title, children }) {
  return (
    <View className="pt-4 pb-7 px-2.5 flex-row items-center bg-bur-blue">
      <Text className="text-lg text-white font-medium">{title}</Text>

      {children}
    </View>
  );
}
