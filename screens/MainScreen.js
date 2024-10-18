// MainScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ProgressBarAndroid } from 'react-native';

const MainScreen = ({ navigation }) => {
    const [hunger, setHunger] = useState(100);
    const [fun, setFun] = useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setHunger(prev => Math.max(prev - 1, 0));
            setFun(prev => Math.max(prev - 1, 0));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View>
            <Text>Hunger Level: {hunger}</Text>
            <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={hunger / 100} />
            <Text>Fun Level: {fun}</Text>
            <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={fun / 100} />
            <Button
                title="Feed Tamagotchi"
                onPress={() => navigation.navigate('Feeding', { hungerLevel: hunger, setHungerLevel: setHunger })}
            />
        </View>
    );
};

export default MainScreen;
