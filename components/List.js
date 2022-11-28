import { Text, View, StyleSheet } from 'react-native';
import appStyles from '../constants/styles';

export default function List({ items = [], title }) {
  return (
    items.length > 0 && (
      <View>
        <Text style={styles.title}>{title}</Text>

        {items.map((item, i) => (
          <View key={i}>
            <Text style={styles.bold}>{item.name}</Text>

            {items[i].translations.map((translation, i) => (
              <Text key={i}>{translation.name}</Text>
            ))}
          </View>
        ))}
      </View>
    )
  );
}

const styles = StyleSheet.create(appStyles);
