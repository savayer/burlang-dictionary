import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import styles from '../constants/styles';

export default function Settings() {
  const webPages = [
    {
      title: 'Web версия словаря',
      link: 'https://t.buryads.com',
    },
    {
      title: 'Discord server',
      link: 'https://discord.gg/8KG84E6y8T',
    },
  ];

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="bg-white min-h-screen px-4">
        {webPages.map((page, i) => (
          <View key={i} className="py-3 border-b border-neutral-200">
            <Text
              className="font-mont-medium text-sm"
              onPress={() => WebBrowser.openBrowserAsync(page.link)}
            >
              {page.title}
            </Text>
          </View>
        ))}

        <View className="py-3">
          <Text className="font-mont-medium text-sm">version 0.0.1</Text>
        </View>
      </View>
    </ScrollView>
  );
}
