import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Index from './src/Index';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Kufam-SemiBoldItalic': require('./src/assets/fonts/Kufam-SemiBoldItalic.ttf'),
    'Lato-Bold': require('./src/assets/fonts/Lato-Bold.ttf'),
    'Lato-BoldItalic': require('./src/assets/fonts/Lato-BoldItalic.ttf'),
    'Lato-Italic': require('./src/assets/fonts/Lato-Italic.ttf'),
    'Lato-Regular': require('./src/assets/fonts/Lato-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Index />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
