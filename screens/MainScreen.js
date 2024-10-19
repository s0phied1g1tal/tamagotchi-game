import React, { useState, useEffect } from 'react';
import { View, Text, ProgressBarAndroid, Button } from 'react-native';

const MainScreen = ({ navigation }) => {
    const [hunger, setHunger] = useState(100); // Starting at 100%
    const [fun, setFun] = useState(100); // Starting at 100%

    // Use useEffect to update hunger and fun over time
    useEffect(() => {
        const interval = setInterval(() => {
            setHunger(prev => Math.max(prev - 1, 0)); // Decrease hunger
            setFun(prev => Math.max(prev - 1, 0)); // Decrease fun
        }, 10000); // Decrease every 10 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const navigateToMusicPlayerScreen = () => {
        navigation.navigate('MusicPlayerScreen', { setFun }); // Pass setFun
    };

    const navigateToFeedingScreen = () => {
        navigation.navigate('FeedingScreen', { hunger, setHunger });
    };
    

    return (
        <View>
            <Text>Hunger Level: {hunger}</Text>
            <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={hunger / 100} />
            <Text>Fun Level: {fun}</Text>
            <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={fun / 100} />
            
            <Button title="Go to Music Player" onPress={navigateToMusicPlayerScreen} />
            <Button title="Go to Feeding Screen" onPress={navigateToFeedingScreen} />
        </View>
    );
};

export default MainScreen;
