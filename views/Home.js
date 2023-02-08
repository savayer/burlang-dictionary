import React from "react";
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
} from 'react-native';
import Navbar from '../components/Navbar';
import List from '../components/List';
import { SafeAreaView } from 'react-native-safe-area-context';
import appStyles from '../constants/styles';
import { useRef, useState } from 'react';
import { translateWord } from '../actions/translate';
import i18n from '../constants/i18n';
import colors from '../constants/colors';
import { Exchange } from '../components/icons';

export default function Home() {
  const [lang, setLang] = useState('ru');
  const [text, setText] = useState('');
  const requestWasSentWithTheText = useRef(false);
  const clicksNumber = useRef(0);
  const [isLoading, setLoading] = useState(false);
  const [outputData, setOutputData] = useState();

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

  async function translate() {
    if (text.trim() === '') {
      alertNoText();
      return;
    }

    const translationType = `${lang}2${lang === 'ru' ? 'bur' : 'ru'}`;

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
      const data = await translateWord(translationType, text);

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
              <ActivityIndicator
                color="#fff"
                style={{ position: 'absolute', right: 10, top: 20 }}
              />
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
              style={{
                marginTop: 10,
                borderRadius: 10,
                overflow: 'hidden',
              }}
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
