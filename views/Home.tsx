import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  Platform,
} from 'react-native';
import Navbar from '@/components/Navbar';
import List from '@/components/List';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';
import { translateWord, translation } from '@/actions/translate';
import i18n from '@/constants/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { twMerge } from 'tailwind-merge';
import { useFetchData } from '@/components/hooks/useFetchData';
import { StatusBar } from 'expo-status-bar';

export default function Home({ route }) {
  const [sourceLanguage, setSourceLanguage] = useState('ru');
  const [text, setText] = useState('');
  const requestWasSentWithTheText = useRef(false);
  const clicksNumber = useRef(0);
  const searchingFavoritesIndex = useRef(0);
  const [isScrollUp, setScrollUp] = useState(true);
  const translationType = useRef(
    `${sourceLanguage}2${sourceLanguage === 'ru' ? 'bur' : 'ru'}`,
  );
  const [isFavorite, setFavorite] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    isLoading,
    result: outputData,
    handleReset,
    handleResponse: handleTranslate,
  } = useFetchData<translation, [string, string]>(
    [] as unknown as translation,
    translateWord,
  );

  function switchLanguage() {
    setSourceLanguage(sourceLanguage === 'ru' ? 'bur' : 'ru');
    setText('');
    handleReset();
  }

  useEffect(() => {
    translationType.current = `${sourceLanguage}2${
      sourceLanguage === 'ru' ? 'bur' : 'ru'
    }`;
  }, [sourceLanguage]);

  useEffect(() => {
    if (route.params?.translation?.type) {
      setSourceLanguage(route.params.translation.type.split('2')[0]);
      setText(route.params.translation.key.toLowerCase());
      requestWasSentWithTheText.current = false;
      searchingFavoritesIndex.current++;
      // we can't use translate method here because setState is asynchronous
      // translate().catch((e) => console.error('search favorite word error', e));
    }
  }, [route]);

  useEffect(() => {
    if (route.params?.translation?.type) {
      onPressHandler().catch((e) =>
        console.error('search favorite word error', e),
      );
    }
  }, [searchingFavoritesIndex.current]);

  async function onPressHandler() {
    if (text.trim() === '') {
      Alert.alert(
        i18n.t('no_text_to_translate'),
        i18n.t('no_text_to_translate_description'),
        [{ text: 'OK' }],
      );
      return;
    }
    if (requestWasSentWithTheText.current) {
      clicksNumber.current++;

      if (clicksNumber.current === 3) {
        Alert.alert(`${i18n.t('calm')}!`, i18n.t('you_have_the_translations'), [
          { text: 'ОК' },
        ]);
        clicksNumber.current = 0;
      }
      return;
    }

    setFavorite(false);

    try {
      await handleTranslate(translationType.current, text);
      const theTextFromStore = await AsyncStorage.getItem(text.toLowerCase());

      if (theTextFromStore) {
        setFavorite(true);
      }

      requestWasSentWithTheText.current = true;
    } catch (error) {
      console.error(error);

      Alert.alert(i18n.t('error'), i18n.t('something_went_wrong'), [
        { text: 'OK' },
      ]);
    }
  }

  const handleFavorites = useCallback(
    async (data) => {
      const key = data[0].name.toLowerCase();
      const value = JSON.stringify({
        id: data[0].translations[0].id,
        translation: data[0].translations[0].name.trim(),
        translationType: translationType.current,
      });

      try {
        if (isFavorite) {
          await AsyncStorage.removeItem(key);
          setFavorite(false);
        } else {
          await AsyncStorage.setItem(key, value);
          setFavorite(true);
        }
      } catch (e) {
        Alert.alert(i18n.t('error'), i18n.t('something_went_wrong'), [
          { text: 'OK' },
        ]);
      }
    },
    [outputData, isFavorite],
  );

  function onScroll({
    nativeEvent: {
      contentOffset: { y: offsetTop },
    },
  }) {
    if (offsetTop <= 0 && !isScrollUp) {
      setScrollUp(true);
    } else if (offsetTop > 0 && isScrollUp) {
      setScrollUp(false);
    }
  }

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <View style={{ height: insets.top }} className="bg-bur-blue" />

      <View className="flex-1 bg-bur-blue">
        <ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
        >
          {Platform.OS === 'ios' && (
            <View className="bg-white h-[1000px] absolute left-0 right-0 -bottom-[1000px]" />
          )}

          <Navbar title={i18n.t(`app_name_${sourceLanguage}`)}>
            {isLoading && <ActivityIndicator color="#fff" className="ml-2.5" />}

            {outputData.exactTranslations &&
              outputData.exactTranslations[0].name !== '-' && (
                <Pressable
                  onPress={handleFavorites.bind(
                    null,
                    outputData.exactTranslations,
                  )}
                  className="ml-auto"
                >
                  <Ionicons
                    name={isFavorite ? 'star' : 'star-outline'}
                    size={20}
                    color={isFavorite ? '#f1b742' : '#a3a3a3'}
                  />
                </Pressable>
              )}
          </Navbar>

          <View className="px-2.5 pb-2.5 -mt-4 bg-white rounded-tl-2xl rounded-tr-2xl overflow-hidden">
            <View className="relative">
              <TextInput
                className="mt-5 p-2.5 pr-10 border border-neutral-400 rounded-md"
                placeholder={i18n.t(`input_placeholder_${sourceLanguage}`)}
                value={text}
                onChangeText={(inputText) => {
                  setText(inputText);
                  requestWasSentWithTheText.current = false;
                }}
              />

              <TouchableOpacity
                activeOpacity={0.6}
                className="absolute right-2 top-1/2"
                onPress={switchLanguage}
              >
                <Ionicons name="swap-horizontal" size={20} color="#0036a7" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={isLoading}
              activeOpacity={0.8}
              className="mt-2.5 rounded-lg overflow-hidden"
              onPress={onPressHandler}
            >
              <View
                className={twMerge(
                  'bg-bur-yellow rounded-xl h-10 justify-center shadow',
                  isLoading && 'bg-neutral-300',
                )}
              >
                <Text className="text-white font-bold text-center text-base">
                  {i18n.t('translate')}
                </Text>
              </View>
            </TouchableOpacity>

            {outputData && (
              <View>
                <List
                  items={outputData.exactTranslations}
                  title={i18n.t('translations')}
                />

                <List
                  items={outputData.occurrences}
                  title={i18n.t('occurrences')}
                />

                <List
                  items={outputData.possibleTranslation}
                  title={i18n.t('possible_translations')}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
