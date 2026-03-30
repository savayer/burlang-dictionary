import { Text, View } from 'react-native';
import { translationItem } from '@/actions/translate';
import { Ionicons } from '@expo/vector-icons';
import getShadow from '@/utils/getShadow';

interface ListProps {
  items?: translationItem[];
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export default function List({ items = [], title, icon, iconColor = '#0036a7' }: ListProps) {
  return (
    items.length > 0 && (
      <View className="mt-5">
        <View className="flex-row items-center mb-3">
          {icon && (
            <Ionicons name={icon} size={20} color={iconColor} style={{ marginRight: 6 }} />
          )}
          <Text className="text-base text-neutral-600 font-bold">{title}</Text>
        </View>

        <View className="gap-2.5">
          {items.map((item, i) => (
            <View
              key={i}
              className="bg-white rounded-xl px-4 py-3 border-l-4"
              style={{ borderLeftColor: iconColor, ...getShadow(1, 1) }}
            >
              <Text className="font-bold text-bur-blue text-base">{item.name}</Text>

              {items[i].translations.map((translation, j) => (
                <Text key={j} className="text-neutral-600 mt-0.5">
                  {translation.name}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    )
  );
}
