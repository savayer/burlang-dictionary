import React from "react";
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView styles={{ height: '100%' }}>
        <View>
          <Text>Settings page</Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
