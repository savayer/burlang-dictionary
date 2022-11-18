import { StyleSheet, Button, TextInput, View } from 'react-native';
import Navbar from './components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');

  function translate() {
    setText('test');
  }

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <Navbar />

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Напишите слово на русском"
            value={text}
            onChangeText={setText}
          />

          <View style={{ marginTop: 10 }}>
            <Button
              uppercase={false}
              title="Перевести"
              onPress={translate}
              color="#685bc7"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
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
});
