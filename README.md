# Buryad language dictionary

Inspired by [burlang.ru](https://burlang.ru/) and [this app](https://play.google.com/store/apps/details?id=com.buryads.orshuulga_mobile).

This is my practice and wish to get more comfortable app
and make a small contribution to the study of the Buryad language.

<img src="https://user-images.githubusercontent.com/19423784/219411497-95d77e8b-ffe9-4a5f-b752-7f8e12be0536.jpg" width="280">
<img src="https://user-images.githubusercontent.com/19423784/219411505-0235fd15-bc88-4670-8478-92303e4d8f62.jpg" width="280">

- [Installation](#installation)
- [Code base](#code-base)
  - [Colors](#colors)
  - [Icons](#icons)
  - [Translations](#translations)
  - [Other](#other)

## Installation

```
npm i
cp .env.example .env
```

and then
```
npm run android
```
or
```
npm run ios
```

To get a build:
```
eas build -p android --profile apk
```


## Code base

This app based on [expo](https://expo.dev/).
[Tailwind](https://tailwindcss.com/) and [NativeWind](https://www.nativewind.dev/) are used for styling

### Colors

Main colors are specified in `./tailwind.config.js`.
There are only two main colors in the Buryat flag, blue and yellow.

There is also `./constants/colors.js` in case it's not possible
to use Tailwind classes. But it's better not to use it frequently.

### Icons

All the icons are stored in the `./components/icons` directory.
You need to use the [react-native-svg](https://www.npmjs.com/package/react-native-svg) package to create an svg icon,
and version should be not higher than 13.0.4 according to Expo requirements.
This requirement may not be relevant, check the documentation

```js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function Chevron(attributes) {
  return (
    <Svg viewBox="0 0 16 24" {...attributes}>
      <Path d="..." />
    </Svg>
  );
}

```

To style the icon you need to use the `className` attribute
with Tailwind classes:

```js
import { Chevron } from 'components/icons';

<Chevron className="h-4 w-4 fill-bur-blue" />;
```


## Translations

- [x] use JSON files with translation keys in `./i18n`;
- [x] translation key should be named via underscore instead of space or hyphen;
- [x] using the same line in all files for the translation keys. This is handy if you want to open both files on the same screen, and you'll always know where to find another translation of the key. If you don't need to create a translation for another language, leave this line empty.
- [ ] use `i18next` and `react-i18next` instead of the current library
- [ ] create screen for change language

## Other

Created `./utils/getShadow` function that uses react-native
approach to set shadow to an element, because for some reason
`shadow` of Tailwind may not work on Android

API methods are stored in `./actions`. There is only one method `translate` for now
