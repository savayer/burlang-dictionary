import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/constants/i18n';
import groupBy from '@/utils/groupBy';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Navbar from '@/components/Navbar';
import { twMerge } from 'tailwind-merge';
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
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState<Record<string, FavoriteItem[]>>();
  const openSwipeableRef = useRef<Swipeable | null>(null);
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

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
      openSwipeableRef.current = null;
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
      <Pressable
        className="my-1 rounded-xl overflow-hidden"
        onPress={() => deleteWordFromFavorites(type, word)}
      >
        {({ pressed }) => (
          <View
            className={twMerge(
              'py-2 px-3 h-full rounded-xl justify-center items-center bg-red-300',
              pressed && 'bg-red-400',
            )}
          >
            <Ionicons name="trash-outline" size={22} color="white" />
          </View>
        )}
      </Pressable>
    ),
    [],
  );

  return (
    <View className="flex-1 bg-bur-bg">
      <StatusBar style="light" />
      <View style={{ height: insets.top }} className="bg-bur-blue" />
      <Navbar title={i18n.t('favorites')} />

      {!favorites || Object.keys(favorites).length === 0 ? (
        <View className="m-auto items-center px-8">
          <View className="bg-bur-yellow-light rounded-full p-6 mb-4">
            <Ionicons name="star" size={48} color="#f1b742" />
          </View>
          <Text className="text-lg font-bold text-neutral-600 text-center">
            {i18n.t('no_favorites')}
          </Text>
          <Text className="text-neutral-400 text-center mt-1 mb-5">
            {i18n.t('no_favorites_description')}
          </Text>
          <Pressable
            className="rounded-full overflow-hidden"
            onPress={() => navigation.navigate('Home')}
          >
            {({ pressed }) => (
              <View
                className={twMerge(
                  'rounded-full px-8 py-3 bg-bur-blue',
                  pressed && 'bg-bur-blue/80',
                )}
              >
                <Text className="text-center text-white text-base font-bold">
                  {i18n.t('search_words')}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      ) : (
        <ScrollView className="px-4 pt-4">
          {Object.keys(favorites).map((type) => (
            <View key={type} className="mb-6">
              <View className="flex-row mb-3">
                <View className="bg-bur-yellow-light rounded-full px-4 py-1.5 flex-row items-center">
                  <Ionicons name="language" size={14} color="#d9a038" />
                  <Text className="text-bur-yellow-dark font-bold ml-1.5 text-sm">
                    {i18n.t(type === 'ru2bur' ? 'ru_to_bur' : 'bur_to_ru')}
                  </Text>
                </View>
              </View>

              <View className="gap-2">
                {favorites[type].map((translation, i) => (
                  <Swipeable
                    key={translation.key}
                    ref={(ref) => {
                      if (ref) {
                        swipeableRefs.current.set(translation.key, ref);
                      } else {
                        swipeableRefs.current.delete(translation.key);
                      }
                    }}
                    onSwipeableWillOpen={() => {
                      const current = swipeableRefs.current.get(
                        translation.key,
                      );
                      if (
                        openSwipeableRef.current &&
                        openSwipeableRef.current !== current
                      ) {
                        openSwipeableRef.current.close();
                      }
                      openSwipeableRef.current = current ?? null;
                    }}
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
                    <Pressable
                      className="rounded-xl overflow-hidden"
                      style={getShadow(2, 1.5)}
                      onPress={searchFavoriteWord.bind(null, translation)}
                    >
                      {({ pressed }) => (
                        <View
                          className={twMerge(
                            'flex-row items-center px-4 py-3 rounded-xl bg-white',
                            pressed && 'bg-neutral-100',
                          )}
                        >
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
                      )}
                    </Pressable>
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
