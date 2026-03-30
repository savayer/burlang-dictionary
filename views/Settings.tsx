import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import i18n from '@/constants/i18n';
import ScreenHeader from '@/components/ScreenHeader';

interface WebPage {
  title: string;
  link: string;
}

export default function Settings() {
  const webPages: WebPage[] = [
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
    <View className="flex-1 bg-white">
      <ScrollView>
        <View className="px-4">
          {webPages.map((page, i) => (
            <View key={i} className="py-3 border-b border-neutral-200">
              <Text
                className="font-mont-medium text-base"
                onPress={() => WebBrowser.openBrowserAsync(page.link)}
              >
                {page.title}
              </Text>
            </View>
          ))}

          <View className="py-3">
            <Text className="font-mont-medium text-base">version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
