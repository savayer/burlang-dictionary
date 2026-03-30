import { ViewStyle } from 'react-native';

export default function getShadow(
  elevation = 2,
  shadowRadius = 1.4,
): ViewStyle {
  return {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius,
    elevation,
  };
}
