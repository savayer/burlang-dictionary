import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';

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
    backgroundColor: colors.blue,
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
});
