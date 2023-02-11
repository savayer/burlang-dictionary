import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import Navbar from '../components/Navbar';
import List from '../components/List';
import { SafeAreaView } from 'react-native-safe-area-context';
import appStyles from '../constants/styles';
import { useRef, useState } from 'react';
import { translateWord } from '../actions/translate';
import i18n from '../constants/i18n';
import colors from '../constants/colors';
import { Exchange, Star } from '../components/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [lang, setLang] = useState('ru');
  const [text, setText] = useState('');
  const requestWasSentWithTheText = useRef(false);
  const clicksNumber = useRef(0);
  const translationType = useRef(`${lang}2${lang === 'ru' ? 'bur' : 'ru'}`);
  const [isLoading, setLoading] = useState(false);
  const [outputData, setOutputData] = useState();
  const [isFavorite, setFavorite] = useState(false);

  function switchLanguage() {
    setLang(lang === 'ru' ? 'bur' : 'ru');
    setText('');
    setOutputData(null);
  }

  const alertNoText = () =>
    Alert.alert(
      i18n.t('no_text_to_translate'),
      i18n.t('no_text_to_translate_description'),
      [{ text: 'OK' }],
    );

  useEffect(() => {
    translationType.current = `${lang}2${lang === 'ru' ? 'bur' : 'ru'}`;
  }, [lang]);

  async function translate() {
    if (text.trim() === '') {
      alertNoText();
      return;
    }

    try {
      if (requestWasSentWithTheText.current) {
        clicksNumber.current++;

        if (clicksNumber.current === 3) {
          Alert.alert(
            `${i18n.t('calm')}!`,
            i18n.t('you_have_the_translations'),
            [{ text: 'ОК' }],
          );
          clicksNumber.current = 0;
        }
        return;
      }

      setLoading(true);
      const data = await translateWord(translationType.current, text);

      requestWasSentWithTheText.current = true;
      setOutputData(data);
    } catch (error) {
      console.error(error);

      Alert.alert(i18n.t('error'), i18n.t('something_went_wrong'), [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleFavorites = useCallback(
    async (data) => {
      const key = data[0].name;
      const value = JSON.stringify({
        id: data[0].translations[0].id,
        translation: data[0].translations[0].name.trim(),
        translationType: translationType.current,
      });

      console.log(key, value);

      try {
        if (isFavorite) {
          await AsyncStorage.removeItem(key);
          setFavorite(false);
        } else {
          await AsyncStorage.setItem(key, value);
          setFavorite(true);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [outputData],
  );

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ minHeight: '100%' }}
    >
      <SafeAreaView
        style={{
          paddingBottom: 10,
          height: '100%',
        }}
      >
        <View style={styles.wrapper}>
          <Navbar title={i18n.t(`app_name_${lang}`)}>
            {isLoading && (
              <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />
            )}

            {outputData?.result && (
              <Pressable
                onPress={handleFavorites.bind(null, outputData.result)}
                style={{ marginLeft: 'auto' }}
              >
                <Star
                  style={{
                    width: 18,
                    height: 18,
                    fill: isFavorite ? colors.yellow : colors.neutral400,
                  }}
                  activeStyle={{
                    fill: isFavorite ? colors.yellow : 'transparent',
                  }}
                />
              </Pressable>
            )}
          </Navbar>

          <View style={styles.container}>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.input}
                placeholder={i18n.t(`input_placeholder_${lang}`)}
                value={text}
                onChangeText={(inputText) => {
                  setText(inputText);
                  requestWasSentWithTheText.current = false;
                }}
              />

              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.langSwitcher}
                onPress={switchLanguage}
              >
                {/*@todo replace it with flags*/}
                <Exchange width={20} height={20} fill={colors.blue} />
              </TouchableOpacity>
            </View>

            <TouchableHighlight
              disabled={isLoading}
              activeOpacity={0.9}
              className="mt-2.5 rounded-lg overflow-hidden"
              onPress={translate}
            >
              <View
                style={
                  isLoading
                    ? { ...styles.button, backgroundColor: colors.neutral300 }
                    : styles.button
                }
              >
                <Text style={styles.buttonText}>{i18n.t('translate')}</Text>
              </View>
            </TouchableHighlight>

            {outputData && (
              <>
                <List
                  items={outputData.result}
                  title={i18n.t('translations')}
                />

                <List
                  items={outputData.include}
                  title={i18n.t('occurrences')}
                />

                <List
                  items={outputData.fuzzy}
                  title={i18n.t('possible_translations')}
                />
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create(appStyles);
