module.exports = {
  expo: {
    name: 'burlang dictionary',
    slug: 'burlang-dictionary',
    owner: 'savayer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'savayer.burlangdictionary',
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.burlang.dictionary',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      url: 'https://u.expo.dev/d1c566a5-58ec-43d8-ac7b-4438126d2462',
      fallbackToCacheTimeout: 5000,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      eas: {
        projectId: 'd1c566a5-58ec-43d8-ac7b-4438126d2462',
      },
    },
  },
};
