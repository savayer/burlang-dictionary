import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './components/Navigation';
import { StatusBar } from 'expo-status-bar';
import colors from './constants/colors';

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor={colors.blue} />

      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </>
  );
}
