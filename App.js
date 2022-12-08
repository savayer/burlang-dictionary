import {
  StyleSheet,
  Button,
  ScrollView,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Navbar from './components/Navbar';
import { useRef, useState } from 'react';
import { translateWord } from './actions/translate';
import t from './constants/t';
import appStyles from './constants/styles';
import List from './components/List';

export default function App() {
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
      t.no_text_to_translate[lang],
      t.no_text_to_translate_description[lang],
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
            'Спокойствие!',
            'Вы уже имеете результат этого перевода на экране.',
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

      Alert.alert('Ошибка', 'Что-то пошло не так, попробуйте снова.', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{
        paddingBottom: 10,
        height: '100%',
      }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <StatusBar style="auto" />

        <View style={styles.wrapper}>
          <Navbar title={t.title[lang]}>
            {isLoading && (
              <ActivityIndicator
                color="#fff"
                style={{ position: 'absolute', right: 10, top: 20 }}
              />
            )}
          </Navbar>

          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder={t.placeholder[lang]}
              value={text}
              onChangeText={(inputText) => {
                setText(inputText);
                requestWasSentWithTheText.current = false;
              }}
            />

            <View style={{ marginTop: 10 }}>
              <Button
                uppercase={false}
                title={t.translate[lang]}
                disabled={isLoading}
                onPress={translate}
                color="#685bc7"
              />
            </View>

            {outputData && (
              <>
                <List items={outputData.result} title={t.translations[lang]} />

                <List items={outputData.include} title={t.occurrences[lang]} />

                <List
                  items={outputData.fuzzy}
                  title={t.possible_translations[lang]}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.langSwitcher}
        onPress={switchLanguage}
      >
        <Text style={styles.langSwitcherText}>⇄</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create(appStyles);
