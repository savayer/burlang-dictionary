import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function Search(attributes) {
  return (
    <Svg viewBox="0 0 24 24" {...attributes}>
      <Path
        d="M10.25 19C15.2206 19 19.25 14.9706 19.25 10C19.25 5.02944 15.2206 1 10.25 1C5.27944 1 1.25 5.02944 1.25 10C1.25 14.9706 5.27944 19 10.25 19Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23 22.75L16.625 16.375"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
