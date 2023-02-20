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
} from 'react-native';
import Navbar from '../components/Navbar';
import List from '../components/List';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';
import { translateWord } from '../actions/translate';
import i18n from '../constants/i18n';
import { Exchange, Star } from '../components/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import classNames from '../utils/classNames';
import { useFetchData } from '../components/hooks/useFetchData';

export default function Home({ route }) {
  const [sourceLanguage, setSourceLanguage] = useState('ru');
  const [text, setText] = useState('');
  const requestWasSentWithTheText = useRef(false);
  const clicksNumber = useRef(0);
  const searchingFavoritesIndex = useRef(0);
  const translationType = useRef(
    `${sourceLanguage}2${sourceLanguage === 'ru' ? 'bur' : 'ru'}`,
  );
  const [isFavorite, setFavorite] = useState(false);

  const {
    isLoading,
    result: outputData,
    handleReset,
    handleResponse: handleTranslate,
  } = useFetchData([], translateWord);

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <Navbar title={i18n.t(`app_name_${sourceLanguage}`)}>
          {isLoading && <ActivityIndicator color="#fff" className="ml-2.5" />}

          {outputData?.result && outputData.result[0]?.name !== '-' && (
            <Pressable
              onPress={handleFavorites.bind(null, outputData.result)}
              className="ml-auto"
            >
              <Star
                className={classNames(
                  'w-5 h-5',
                  isFavorite ? 'fill-bur-yellow' : 'fill-neutral-400',
                )}
                activeClassName={
                  isFavorite ? 'fill-bur-yellow' : 'fill-transparent'
                }
              />
            </Pressable>
          )}
        </Navbar>

        <View className="px-2.5 pb-2.5 -mt-4 flex-1 bg-white rounded-tl-2xl rounded-tr-2xl overflow-hidden">
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
              <Exchange className="w-5 h-5 fill-bur-blue" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={isLoading}
            activeOpacity={0.8}
            className="mt-2.5 rounded-lg overflow-hidden"
            onPress={onPressHandler}
          >
            <View
              className={classNames(
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
            <>
              <List items={outputData.result} title={i18n.t('translations')} />

              <List items={outputData.include} title={i18n.t('occurrences')} />

              <List
                items={outputData.fuzzy}
                title={i18n.t('possible_translations')}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
