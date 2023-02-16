import { Text, View } from 'react-native';

export default function List({ items = [], title }) {
  return (
    items.length > 0 && (
      <View>
        <View className="border-b border-neutral-200 pb-1 mt-5 mb-2.5">
          <Text className="text-lg text-neutral-600 font-medium">{title}</Text>
        </View>

        {items.map((item, i) => (
          <View key={i} className="mb-2">
            <Text className="font-bold">{item.name}</Text>

            {items[i].translations.map((translation, i) => (
              <Text key={i}>{translation.name}</Text>
            ))}
          </View>
        ))}
      </View>
    )
  );
}
