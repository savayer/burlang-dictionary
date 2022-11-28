import {
  StyleSheet,
  Button,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Navbar from './components/Navbar';
import { useState } from 'react';
import { translateWord } from './actions/translate';
import t from './constants/t';
import appStyles from './constants/styles';
import List from './components/List';

export default function App() {
  const [lang, setLang] = useState('ru');
  const [text, setText] = useState('');
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
    const data = await translateWord(translationType, text);

    setOutputData(data);
  }

  return (
    <SafeAreaView
      style={{
        paddingTop: StatusBar.currentHeight + 5,
        paddingBottom: 10,
        height: '100%',
      }}
    >
      <ScrollView>
        <View style={styles.wrapper}>
          <Navbar title={t.title[lang]} />

          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder={t.placeholder[lang]}
              value={text}
              onChangeText={setText}
            />

            <View style={{ marginTop: 10 }}>
              <Button
                uppercase={false}
                title={t.translate[lang]}
                onPress={translate}
                color="#685bc7"
              />
            </View>

            {outputData && (
              <>
                <List items={outputData.result} title={t.translations[lang]} />

                <List items={outputData.include} title={t.occurences[lang]} />

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
