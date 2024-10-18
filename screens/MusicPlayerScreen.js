import React, { useState, useEffect } from 'react';
import { View, Text, Button, Slider } from 'react-native';
import { Audio } from 'expo-av'; // Ensure you have installed expo-av

const MusicPlayerScreen = () => {
    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // For progress tracking
    const [duration, setDuration] = useState(0); // Total duration of the sound

    const playSound = async () => {
        const { sound, status } = await Audio.Sound.createAsync(
            require('./path_to_your_song.mp3'), // Replace with your actual audio file path
            {
                isLooping: false,
                shouldPlay: true,
            }
        );

        setSound(sound);
        setDuration(status.durationMillis);
        sound.setOnPlaybackStatusUpdate(updateStatus);
        setIsPlaying(true);
    };

    const updateStatus = (status) => {
        if (status.isLoaded && status.isPlaying) {
            setProgress(status.positionMillis);
        }
    };

    const pauseSound = async () => {
        await sound.pauseAsync();
        setIsPlaying(false);
    };

    const stopSound = async () => {
        await sound.stopAsync();
        setIsPlaying(false);
        setProgress(0); // Reset progress when stopped
        setSound(null);
    };

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync(); // Cleanup the sound when the component unmounts
        } : undefined;
    }, [sound]);

    return (
        <View>
            <Text>Music Player</Text>
            <Button title={isPlaying ? "Pause" : "Play"} onPress={isPlaying ? pauseSound : playSound} />
            <Button title="Stop" onPress={stopSound} />
            {/* Progress bar */}
            <Slider
                value={progress}
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={async (value) => {
                    await sound.setPositionAsync(value);
                }}
                disabled={!isPlaying}
            />
            <Text>{`Progress: ${(progress / 1000).toFixed(0)}s / ${(duration / 1000).toFixed(0)}s`}</Text>
        </View>
    );
};

export default MusicPlayerScreen;
