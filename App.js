import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import BeginScreen from './screens/BeginScreen';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import MusicPlayerScreen from './screens/MusicPlayerScreen';
import FeedingScreen from './screens/FeedingScreen';

const Stack = createNativeStackNavigator();

// Override default Text component
const CustomText = ({ style, ...props }) => {
  return <Text {...props} style={[styles.customFont, style]} />;
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: 'Cherry Bomb One', // Use the font name as defined in your font file
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BeginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BeginScreen" component={BeginScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="MusicPlayerScreen" component={MusicPlayerScreen} />
        <Stack.Screen name="FeedingScreen" component={FeedingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Then you can use <CustomText> instead of <Text> throughout your app
