import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Slider from '@react-native-community/slider'; // Updated import

const MusicPlayerScreen = ({ route }) => {
    const [sound, setSound] = useState(null); // Manage sound instance
    const [isPlaying, setIsPlaying] = useState(false); // Manage play/pause state
    const [progress, setProgress] = useState(0); // Track current position in the song
    const [duration, setDuration] = useState(0); // Track the duration of the song
    const { setFun } = route.params; // Destructure setFun from route.params

    const playSound = async () => {
        const { sound, status } = await Audio.Sound.createAsync(
            require('../assets/audio/ETA.mp3'), // Correct path to your audio file
            {
                isLooping: false,
                shouldPlay: true,
            }
        );

        setSound(sound);
        setDuration(status.durationMillis);
        sound.setOnPlaybackStatusUpdate(updateStatus);
        setIsPlaying(true);
        setFun(prev => Math.min(prev + 5, 100)); // Increase fun level when music plays
    };

    const updateStatus = (status) => {
        if (status.isLoaded && status.isPlaying) {
            setProgress(status.positionMillis); // Update progress as song plays
        }
    };

    const pauseSound = async () => {
        await sound.pauseAsync();
        setIsPlaying(false);
    };

    const stopSound = async () => {
        await sound.stopAsync();
        setIsPlaying(false);
        setProgress(0);
        setSound(null);
    };

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync();
        } : undefined;
    }, [sound]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Music Player</Text>

            {/* Play/Pause Button */}
            <Button title={isPlaying ? "Pause" : "Play"} onPress={isPlaying ? pauseSound : playSound} />
            
            {/* Stop Button */}
            <Button title="Stop" onPress={stopSound} />

            {/* Slider for tracking song progress */}
            <Slider
                value={progress}
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={async (value) => {
                    await sound.setPositionAsync(value);
                }}
                disabled={!isPlaying}
            />

            {/* Display progress */}
            <Text>{`Progress: ${(progress / 1000).toFixed(0)}s / ${(duration / 1000).toFixed(0)}s`}</Text>
        </View>
    );
};

export default MusicPlayerScreen;
