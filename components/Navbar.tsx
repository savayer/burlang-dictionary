import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import getShadow from '@/utils/getShadow';

interface NavbarProps {
  title: string;
  children?: ReactNode;
}

export default function Navbar({ title, children }: NavbarProps) {
  return (
    <View
      className="pt-4 pb-5 px-4 flex-row items-center bg-white"
      style={getShadow(3, 2)}
    >
      <Text className="text-xl text-bur-blue font-bold">{title}</Text>

      {children}
    </View>
  );
}
