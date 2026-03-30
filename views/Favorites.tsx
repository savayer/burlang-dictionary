import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '@/constants/colors';
import i18n from '@/constants/i18n';
import groupBy from '@/utils/groupBy';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';
import getShadow from '@/utils/getShadow';

interface FavoriteItem {
  key: string;
  value: string;
  type: string;
}

async function getAllKeys(): Promise<readonly string[]> {
  let keys: readonly string[] = [];

  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.error('getting keys error:', e);
  }

  return keys;
}

async function getAllValues(keys: readonly string[]) {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (e) {
    console.error('getting values error:', e);
  }
}

const loadFavorites = async (): Promise<Record<string, FavoriteItem[]>> => {
  const keys = await getAllKeys();
  const data = await getAllValues(keys);

  const parsedArray = (data ?? []).map(([key, value]) => {
    const parsedData = JSON.parse(value ?? '{}');

    return {
      key,
      value: parsedData.translation,
      type: parsedData.translationType,
    };
  });

  return groupBy(parsedArray, 'type');
};

interface FavoritesProps {
  navigation: any;
}

export default function Favorites({ navigation }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Record<string, FavoriteItem[]>>();

  useEffect(() => {
    navigation.addListener('focus', () => {
      loadFavorites().then((data) => setFavorites(data));
    });
  }, []);

  function searchFavoriteWord(translation: FavoriteItem) {
    navigation.navigate('Home', {
      translation,
    });
  }

  async function deleteWordFromFavorites(type: string, key: string) {
    try {
      await AsyncStorage.removeItem(key);
      const favorites = await loadFavorites();

      setFavorites(favorites);
    } catch (e) {
      console.error(e);
      Alert.alert(i18n.t('error'), i18n.t('something_went_wrong'), [
        { text: 'OK' },
      ]);
    }
  }

  const DeleteButton = useCallback(
    (type: string, word: string) => (
      <TouchableOpacity
        activeOpacity={0.9}
        className="bg-red-500 py-2 px-4 my-1 rounded-xl justify-center"
        onPress={() => deleteWordFromFavorites(type, word)}
      >
        <Text className="text-white m-auto font-bold">Удалить</Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <View className="flex-1 bg-bur-bg">
      {!favorites || Object.keys(favorites).length === 0 ? (
        <View className="m-auto items-center px-8">
          <View className="bg-bur-yellow-light rounded-full p-6 mb-4">
            <Ionicons name="star" size={48} color="#f1b742" />
          </View>
          <Text className="text-lg font-bold text-neutral-600 text-center">
            Нет избранных слов
          </Text>
          <Text className="text-neutral-400 text-center mt-1 mb-5">
            Добавляйте слова в избранное, чтобы быстро к ним возвращаться
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-full overflow-hidden"
            onPress={() => navigation.navigate('Home')}
          >
            <View className="bg-bur-blue rounded-full px-8 py-3">
              <Text className="text-center text-white text-base font-bold">
                Искать слова
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="px-4 pt-4">
          {Object.keys(favorites).map((type) => (
            <View key={type} className="mb-6">
              <View className="flex-row mb-3">
                <View className="bg-bur-yellow-light rounded-full px-4 py-1.5 flex-row items-center">
                  <Ionicons name="language" size={14} color="#d9a038" />
                  <Text className="text-bur-yellow-dark font-bold ml-1.5 text-sm">
                    {type === 'ru2bur'
                      ? 'Русский → Бурятский'
                      : 'Бурятский → Русский'}
                  </Text>
                </View>
              </View>

              <View className="gap-2">
                {favorites[type].map((translation, i) => (
                  <Swipeable
                    key={i}
                    renderLeftActions={DeleteButton.bind(
                      null,
                      type,
                      translation.key,
                    )}
                    renderRightActions={DeleteButton.bind(
                      null,
                      type,
                      translation.key,
                    )}
                  >
                    <TouchableHighlight
                      underlayColor={colors.neutral100}
                      className="bg-white rounded-xl overflow-hidden"
                      style={getShadow(2, 1.5)}
                      onPress={searchFavoriteWord.bind(null, translation)}
                    >
                      <View className="flex-row items-center px-4 py-3">
                        <View className="flex-1">
                          <Text className="font-bold text-bur-blue text-base">
                            {translation.key.toLowerCase()}
                          </Text>
                          <Text className="text-neutral-600 mt-0.5">
                            {translation.value}
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="#a3a3a3"
                        />
                      </View>
                    </TouchableHighlight>
                  </Swipeable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
