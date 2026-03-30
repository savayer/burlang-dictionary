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
import { LinearGradient } from 'expo-linear-gradient';
import getShadow from '@/utils/getShadow';

export default function Home({ route }) {
  const [sourceLanguage, setSourceLanguage] = useState('ru');
  const [text, setText] = useState('');
  const requestWasSentWithTheText = useRef(false);
  const clicksNumber = useRef(0);
  const searchingFavoritesIndex = useRef(0);
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

  const translationType = useRef(
    `${sourceLanguage}2${sourceLanguage === 'ru' ? 'bur' : 'ru'}`,
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

  const fromLang = i18n
    .t(sourceLanguage === 'ru' ? 'russian' : 'buryat')
    .toUpperCase();
  const toLang = i18n
    .t(sourceLanguage === 'ru' ? 'buryat' : 'russian')
    .toUpperCase();

  return (
    <View className="flex-1 bg-bur-bg">
      <StatusBar style="light" />
      <View style={{ height: insets.top }} className="bg-bur-blue" />

      <Navbar title={i18n.t(`app_name_${sourceLanguage}`)}>
        {isLoading && <ActivityIndicator color="#ffffff" className="ml-2.5" />}

        {outputData.exactTranslations &&
          outputData.exactTranslations[0].name !== '-' && (
            <Pressable
              onPress={handleFavorites.bind(null, outputData.exactTranslations)}
              className="ml-auto"
            >
              <Ionicons
                name={isFavorite ? 'star' : 'star-outline'}
                size={22}
                color={isFavorite ? '#f1b742' : 'rgba(255,255,255,0.5)'}
              />
            </Pressable>
          )}
      </Navbar>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-bur-bg">
        <View className="px-4 pt-5 pb-4">
          {/* Language Switcher */}
          <View className="flex-row items-center justify-center mb-4">
            <View
              className="bg-white rounded-full flex-row items-center px-1 py-1"
              style={getShadow(2, 2)}
            >
              <View className="flex-1 py-1.5">
                <Text className="text-bur-blue font-bold text-sm text-center">
                  {fromLang}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={switchLanguage}
                className="shrink-0 mx-1"
              >
                <View className="bg-bur-yellow rounded-full p-1.5">
                  <Ionicons name="swap-horizontal" size={18} color="#ffffff" />
                </View>
              </TouchableOpacity>

              <View className="flex-1 py-1.5">
                <Text className="text-bur-blue font-bold text-sm text-center">
                  {toLang}
                </Text>
              </View>
            </View>
          </View>

          {/* Search Input */}
          <View
            className="flex-row items-center bg-white border border-neutral-200 rounded-full px-4 py-0.5"
            style={getShadow(1, 1)}
          >
            <Ionicons name="search" size={18} color="#a3a3a3" />
            <TextInput
              className="flex-1 ml-2.5 py-3 leading-5 text-base"
              placeholder={i18n.t(`input_placeholder_${sourceLanguage}`)}
              placeholderTextColor="#a3a3a3"
              value={text}
              onChangeText={(inputText) => {
                setText(inputText);
                requestWasSentWithTheText.current = false;
              }}
            />
            {text.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setText('');
                  handleReset();
                  requestWasSentWithTheText.current = false;
                }}
              >
                <Ionicons name="close-circle" size={18} color="#a3a3a3" />
              </TouchableOpacity>
            )}
          </View>

          {/* Translate Button */}
          <TouchableOpacity
            disabled={isLoading}
            activeOpacity={0.8}
            className="mt-3"
            onPress={onPressHandler}
          >
            {isLoading ? (
              <View className="bg-neutral-300 rounded-full h-12 justify-center">
                <Text className="text-white font-bold text-center text-base">
                  {i18n.t('translate')}
                </Text>
              </View>
            ) : (
              <LinearGradient
                colors={['#0040c1', '#002a85']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 9999, height: 48, justifyContent: 'center' }}
              >
                <Text className="text-white font-bold text-center text-base">
                  {i18n.t('translate')}
                </Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>

        {/* Results */}
        {outputData && (
          <View className="px-4 pb-6">
            <List
              items={outputData.exactTranslations}
              title={i18n.t('translations')}
              icon="checkmark-circle"
              iconColor="#0036a7"
            />

            <List
              items={outputData.occurrences}
              title={i18n.t('occurrences')}
              icon="layers"
              iconColor="#f1b742"
            />

            <List
              items={outputData.possibleTranslation}
              title={i18n.t('possible_translations')}
              icon="help-circle"
              iconColor="#a3a3a3"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
