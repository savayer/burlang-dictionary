import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface NavbarProps {
  title: string;
  children?: ReactNode;
}

export default function Navbar({ title, children }: NavbarProps) {
  return (
    <View className="pt-4 pb-7 px-2.5 flex-row items-center bg-bur-blue">
      <Text className="text-lg text-white font-medium">{title}</Text>

      {children}
    </View>
  );
}
