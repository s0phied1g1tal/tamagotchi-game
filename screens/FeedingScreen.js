// FeedingScreen.js
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const FeedingScreen = ({ route, navigation }) => {
    const { hungerLevel, setHungerLevel } = route.params; // Get parameters from the route

    const feedTamagochi = () => {
        // Logic to feed Tamagotchi and update hunger level
        setHungerLevel(hungerLevel + 10); // Increase hunger level
        navigation.goBack(); // Go back to MainScreen after feeding
    };

    return (
        <View>
            <Text>Feed the Tamagotchi!</Text>
            <Button title="Feed" onPress={feedTamagochi} />
        </View>
    );
};

export default FeedingScreen;
