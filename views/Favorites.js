import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';
import i18n from '../constants/i18n';
import groupBy from '../utils/groupBy';
import ScreenHeader from '../components/ScreenHeader';
import Swipeable from 'react-native-gesture-handler/Swipeable';

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

const loadFavorites = async () => {
  const keys = await getAllKeys();
  const data = await getAllValues(keys);

  const parsedArray = data.map(([key, value]) => {
    const parsedData = JSON.parse(value);

    return {
      key,
      value: parsedData.translation,
      type: parsedData.translationType,
    };
  });

  return groupBy(parsedArray, 'type');
};

export default function Favorites({ navigation }) {
  const [favorites, setFavorites] = useState();

  /*
   * Load favorites by open the screen
   * */
  useEffect(() => {
    navigation.addListener('focus', () => {
      loadFavorites().then((data) => setFavorites(data));
    });
  }, []);

  function searchFavoriteWord(translation) {
    navigation.navigate('Home', {
      translation,
    });
  }

  async function deleteWordFromFavorites(type, key) {
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
    (type, word) => (
      <TouchableOpacity
        activeOpacity={0.9}
        className="bg-bur-blue py-2 px-4 my-1 rounded"
        onPress={() => deleteWordFromFavorites(type, word)}
      >
        <Text className="text-white m-auto font-bold">Удалить</Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <ScrollView>
      <SafeAreaView className="min-h-screen bg-white">
        <ScreenHeader
          className="mb-0"
          showBackButton={false}
          title={i18n.t('favorites')}
        />

        {(!favorites || Object.keys(favorites).length === 0) && (
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
            {Object.keys(favorites).map((type) => (
              <View key={type} className="mb-6">
                <View
                  className="bg-bur-yellow px-4 py-2"
                  style={{ backgroundColor: '#f1b742' }}
                >
                  <Text className="text-white font-bold">
                    {type === 'ru2bur'
                      ? 'Русский > Бурятский'
                      : 'Бурятский > Русский'}
                  </Text>
                </View>

                <View className="px-2">
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
                        className="px-2 my-1 bg-white"
                        onPress={searchFavoriteWord.bind(null, translation)}
                      >
                        <>
                          <View className="border-b border-neutral-300 py-1">
                            <Text className="font-bold">
                              {translation.key.toLowerCase()}
                            </Text>
                          </View>

                          <Text>{translation.value}</Text>
                        </>
                      </TouchableHighlight>
                    </Swipeable>
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
