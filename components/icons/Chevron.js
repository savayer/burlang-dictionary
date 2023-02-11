import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function Chevron(attributes) {
  return (
    <Svg viewBox="0 0 16 24" {...attributes}>
      <Path d="M0.5 12C0.5 11.3 0.8 10.7 1.3 10.3L12.5 0.499973C13.3 -0.200027 14.4 -0.100027 15.1 0.699973C15.7 1.49997 15.7 2.59997 14.9 3.19997L5.1 11.8C5 11.9 5 12 5.1 12.1L14.9 20.7C15.7 21.4 15.8 22.5 15.1 23.3C14.4 24.1 13.3 24.2 12.5 23.5C12.5 23.5 12.5 23.5 12.4 23.4L1.3 13.7C0.8 13.3 0.5 12.6 0.5 12Z" />
    </Svg>
  );
}
