import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import BeginScreen from './screens/BeginScreen';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import MusicPlayerScreen from './screens/MusicPlayerScreen';
import FeedingScreen from './screens/FeedingScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Cherry Bomb One': require('./assets/fonts/cherrybombone-regular.ttf'), // Correct path to your font
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BeginScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="BeginScreen" component={BeginScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      
        {/* Pass song data to MusicPlayerScreen */}
        <Stack.Screen name="MusicPlayerScreen" component={MusicPlayerScreen} />
        <Stack.Screen name="FeedingScreen" component={FeedingScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  customFont: {
    fontFamily: 'Cherry Bomb One',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF1879', 
  },
  loadingText: {
    color: 'white',
    fontSize: 20,
  },
});
