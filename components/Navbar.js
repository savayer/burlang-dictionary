import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Navbar({ title, children }) {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#685bc7',
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
});
