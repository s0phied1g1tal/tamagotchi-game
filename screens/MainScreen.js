import React from 'react';
import { View, Text, Button } from 'react-native';

const MainScreen = ({ navigation, hunger, fun }) => {
    return (
        <View>
            <Text>Main Screen</Text>
            <Text>Hunger: {hunger}</Text>
            <Text>Fun: {fun}</Text>
            <Button title="Play with Tamagotchi" onPress={() => navigation.navigate('Feeding Mini Game')} />
            {/* You can add more buttons here if needed */}
        </View>
    );
};

export default MainScreen;
