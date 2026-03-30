import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';

interface WebPage {
  title: string;
  link: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

export default function Settings() {
  const webPages: WebPage[] = [
    {
      title: 'Web версия словаря',
      link: 'https://t.buryads.com',
      icon: 'globe-outline',
      iconColor: '#0036a7',
    },
    {
      title: 'Discord server',
      link: 'https://discord.gg/8KG84E6y8T',
      icon: 'chatbubbles-outline',
      iconColor: '#f1b742',
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-4 pt-4 flex-1">
          <View className="gap-3">
            {webPages.map((page, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => WebBrowser.openBrowserAsync(page.link)}
              >
                <View className="flex-row items-center bg-neutral-50 rounded-xl px-4 py-4">
                  <View
                    className="bg-bur-blue-light rounded-full p-2.5 mr-3"
                  >
                    <Ionicons name={page.icon} size={20} color={page.iconColor} />
                  </View>
                  <Text className="flex-1 font-bold text-base text-neutral-800">
                    {page.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#a3a3a3" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="py-6 items-center">
          <Text className="text-neutral-300 text-sm">version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
