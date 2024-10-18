import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

const FeedingMiniGame = ({ onFeed }) => {
    const handleFeed = () => {
        onFeed();
        Alert.alert('Yummy!', 'Your Tamagotchi has been fed!');
    };

    return (
        <View>
            <Text>Feeding Mini Game</Text>
            <Button title="Feed Tamagotchi" onPress={handleFeed} />
        </View>
    );
};

export default FeedingMiniGame;
