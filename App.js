import {
  StyleSheet,
  Button,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Navbar from './components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { translateWord } from './actions/translate';

const t = {
  title: {
    ru: 'Русско-Бурятский словарь',
    bur: 'Буряад-Ород толи',
  },
  placeholder: {
    ru: 'Напишите слово на русском',
    bur: 'Үгэ бэшэгты',
  },
  translate: {
    ru: 'Перевести',
    bur: 'Оршуулха',
  },
  alertNoTextTitle: {
    ru: 'Нечего переводить',
    bur: 'Оршуулха юумэ үгы',
  },
  alertNoTextDescription: {
    ru: 'Введите слово для перевода',
    bur: 'Үгэ бэшэгты',
  },
};

export default function App() {
  const [lang, setLang] = useState('ru');
  const [text, setText] = useState('');

  function switchLanguage() {
    setLang(lang === 'ru' ? 'bur' : 'ru');
    setText('');
  }

  const alertNoText = () =>
    Alert.alert(t.alertNoTextTitle[lang], t.alertNoTextDescription[lang], [
      { text: 'OK' },
    ]);

  async function translate() {
    if (text.trim() === '') {
      alertNoText();
      return;
    }

    const translationType = `${lang}2${lang === 'ru' ? 'bur' : 'ru'}`;
    const data = await translateWord(translationType, text);

    console.log(data);
  }

  return (
    <SafeAreaView>
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
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.langSwitcher}
          onPress={switchLanguage}
        >
          <Text style={styles.langSwitcherText}>⇄</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    height: '100%',
  },
  container: {
    paddingHorizontal: 10,
  },
  input: {
    marginTop: 20,
    padding: 10,
    borderColor: '#a3a3a3',
    borderRadius: 5,
    borderWidth: 1,
  },
  langSwitcher: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#a3a3a3',
    marginLeft: 'auto',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  langSwitcherText: {
    color: '#fff',
    fontSize: 30,
    margin: 'auto',
    textAlign: 'center',
  },
});
