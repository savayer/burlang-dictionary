import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';
import i18n from '../constants/i18n';
import { useNavigation } from '@react-navigation/native';
import groupBy from '../utils/groupBy';
import ScreenHeader from '../components/ScreenHeader';

async function getAllKeys() {
  let keys = [];

  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.error('getting keys error:', e);
  }

  return keys;
}

async function getAllValues(keys) {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (e) {
    console.error('getting values error:', e);
  }
}

export default function Favorites({ navigation }) {
  const [favorites, setFavorites] = useState();

  const init = useCallback(async () => {
    const keys = await getAllKeys();

    return await getAllValues(keys);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      init().then((data) => {
        const parsedArray = data.map(([key, value]) => {
          const parsedData = JSON.parse(value);
          return {
            key,
            value: parsedData.translation,
            type: parsedData.translationType,
          };
        });

        console.log(groupBy(parsedArray, 'type'));

        setFavorites(groupBy(parsedArray, 'type'));
      });
    });
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView className="min-h-screen bg-white">
        <ScreenHeader
          className="mb-0"
          showBackButton={false}
          title={i18n.t('favorites')}
        />

        {!favorites && (
          <View className="m-auto">
            <Text className="text-lg font-bold">Нет избранных слов</Text>
            <TouchableHighlight
              activeOpacity={0.9}
              className="mt-2.5 rounded-lg overflow-hidden"
              onPress={() => navigation.navigate('Home')}
            >
              <View className="bg-bur-yellow px-2 py-2">
                <Text className="text-center text-white text-base font-bold">
                  Искать слова
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        )}

        {favorites && Object.keys(favorites).length > 0 && (
          <View>
            {Object.keys(favorites).map((type, i) => (
              <View key={i} className="mb-6">
                <View
                  className="bg-bur-yellow px-2 py-2"
                  style={{ backgroundColor: '#f1b742' }}
                >
                  <Text className="text-white font-bold">
                    {type === 'ru2bur'
                      ? 'Русский > Бурятский'
                      : 'Бурятский > Русский'}
                  </Text>
                </View>

                <View className="px-2 gap-2">
                  {favorites[type].map((translation) => (
                    <View key={translation.id}>
                      <View className="border-b border-neutral-300 py-2">
                        <Text className="font-bold">{translation.key}</Text>
                      </View>

                      <Text>{translation.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
