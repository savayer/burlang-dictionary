import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import getShadow from '@/utils/getShadow';
import i18n from '@/constants/i18n';

interface WebPage {
  title: string;
  link: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

export default function Settings() {
  const webPages: (WebPage & { iconBg: string })[] = [
    {
      title: 'Web версия словаря',
      link: 'https://t.buryads.com',
      icon: 'globe-outline',
      iconColor: '#0036a7',
      iconBg: 'bg-bur-blue-light',
    },
    {
      title: 'Discord server',
      link: 'https://discord.gg/8KG84E6y8T',
      icon: 'chatbubbles-outline',
      iconColor: '#f1b742',
      iconBg: 'bg-bur-yellow-light',
    },
  ];

  return (
    <View className="flex-1 bg-bur-bg">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-4 pt-6 flex-1">
          {/* App Identity */}
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-bur-blue">
              {i18n.t('app_name_ru')}
            </Text>
            <View className="w-12 h-1 bg-bur-yellow rounded-full mt-2" />
          </View>

          <View className="gap-3">
            {webPages.map((page, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => WebBrowser.openBrowserAsync(page.link)}
              >
                <View
                  className="flex-row items-center bg-white rounded-xl px-4 py-4"
                  style={getShadow(2, 1.5)}
                >
                  <View
                    className={`${page.iconBg} rounded-full p-2.5 mr-3`}
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
          <Text className="text-neutral-400 text-sm">version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
