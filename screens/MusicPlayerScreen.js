import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider'; // Importing Slider from the community package

const MusicPlayerScreen = ({ route }) => {
    const [sound, setSound] = useState(null); // Manage sound instance
    const [isPlaying, setIsPlaying] = useState(false); // Manage play/pause state
    const [progress, setProgress] = useState(0); // Track current position in the song
    const [duration, setDuration] = useState(0); // Track the duration of the song
    const { setFun } = route.params; // Destructure setFun from route.params

    const playSound = async () => {
        try {
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
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    const updateStatus = (status) => {
        if (status.isLoaded) {
            // Update the progress if the sound is playing
            if (status.isPlaying) {
                setProgress(status.positionMillis); // Update progress as the song plays
            }
            // Ensure the duration is set when the audio is loaded
            if (duration === 0) {
                setDuration(status.durationMillis);
            }
        }
    };

    const pauseSound = async () => {
        await sound.pauseAsync();
        setIsPlaying(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying && sound) {
                sound.getStatusAsync().then(status => {
                    if (status.isPlaying) {
                        setProgress(status.positionMillis);
                    }
                });
            }
        }, 1000); // Update progress every second
    
        return () => clearInterval(interval); // Cleanup on unmount
    }, [isPlaying, sound]);

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
        <View style={styles.container}>
            <Text style={styles.title}>Music Player</Text>

            {/* Play/Pause Button */}
            <Button title={isPlaying ? "Pause" : "Play"} onPress={isPlaying ? pauseSound : playSound} />
            
            {/* Stop Button */}
            <Button title="Stop" onPress={stopSound} />

            {/* Slider for tracking song progress */}
            <Slider
                style={styles.slider}
                value={progress}
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={async (value) => {
                    if (sound) {
                        await sound.setPositionAsync(value);
                        setProgress(value); // Update local progress
                    }
                }}
                disabled={!isPlaying}
            />

            {/* Display progress */}
            <Text>{`Progress: ${(progress / 1000).toFixed(0)}s / ${(duration / 1000).toFixed(0)}s`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    slider: {
        width: '80%',
        height: 40,
    },
});

export default MusicPlayerScreen;
