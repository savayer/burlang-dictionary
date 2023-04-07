import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './components/Navigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <>
      <StatusBar />

      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </>
  );
}
