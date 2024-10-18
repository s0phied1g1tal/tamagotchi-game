// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BeginScreen from './screens/BeginScreen';  // Ensure this is imported
import LoginScreen from './screens/LoginScreen';  // Ensure this is imported
import MainScreen from './screens/MainScreen';  // Main screen
import FeedingScreen from './screens/FeedingScreen';  // Feeding screen if needed

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Begin">
                <Stack.Screen name="Begin" component={BeginScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Feeding" component={FeedingScreen} />
                {/* Add other screens here if needed */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
