import { ViewStyle } from 'react-native';

export default function getShadow(
  elevation = 2,
  shadowRadius = 1.4,
): ViewStyle {
  return {
    shadowColor: '#1a1a2e',
    shadowOffset: {
      width: 0,
      height: elevation > 4 ? 2 : 1,
    },
    shadowOpacity: 0.12,
    shadowRadius,
    elevation,
  };
}
