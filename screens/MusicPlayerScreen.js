import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider'; // Importing Slider from the community package

const MusicPlayerScreen = ({ route }) => {
    const [sound, setSound] = useState(null); // Manage sound instance
    const [isPlaying, setIsPlaying] = useState(false); // Manage play/pause state
    const [progress, setProgress] = useState(0); // Track current position in the song
    const [duration, setDuration] = useState(0); // Track the duration of the song
    const [currentSong, setCurrentSong] = useState(null); // Track the currently playing song
    const { setFun } = route.params; // Destructure setFun from route.params

    // Define an array of songs
    const songs = [
        { title: 'ETA', path: require('../assets/audio/ETA.mp3') },
        { title: 'BuriBuri', path: require('../assets/audio/BuriBuri.mp3') },
        { title: 'Clint Eastwood', path: require('../assets/audio/Clint Eastwood.mp3') },
        { title: 'Espresso', path: require('../assets/audio/Espresso.mp3') },
        { title: 'TTYL', path: require('../assets/audio/TTYL.mp3') },
    ];

    const playSound = async (song) => {
        // Stop current sound if it's loaded and playing
        if (sound) {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
                await sound.stopAsync();
                await sound.unloadAsync(); // Ensure the sound is unloaded
            }
        }
    
        try {
            const { sound: newSound, status } = await Audio.Sound.createAsync(
                song.path, // Use the provided song path
                {
                    isLooping: false,
                    shouldPlay: true,
                }
            );
    
            setSound(newSound);
            setCurrentSong(song.title); // Set the currently playing song title
            setDuration(status.durationMillis);
            newSound.setOnPlaybackStatusUpdate(updateStatus);
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

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync();
        } : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            {/* GIF at the top */}
            <Image
                source={require('../assets/kirby.gif')} // Replace with your GIF path
                style={styles.gif}
                resizeMode="contain" // Ensure the GIF scales properly
            />

            {/* Title of the song */}
            <Text style={styles.title}>Now Playing: {currentSong || 'Select a song'}</Text>

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

            {/* Display duration */}
            <Text style={styles.duration}>
                {`Progress: ${(progress / 1000).toFixed(0)}s / ${(duration / 1000).toFixed(0)}s`}
            </Text>

            {/* Control Buttons */}
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => { /* Rewind logic */ }}>
                    <Text style={styles.controlButton}>{'|<'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={isPlaying ? pauseSound : () => {}}>
                    <Text style={styles.controlButton}>{isPlaying ? '||' : '>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { /* Forward logic */ }}>
                    <Text style={styles.controlButton}>{'>|'}</Text>
                </TouchableOpacity>
            </View>

            {/* Library Section */}
            <Text style={styles.libraryTitle}>Library</Text>
            <ScrollView horizontal contentContainerStyle={styles.library}>
                {songs.map((song, index) => (
                    <TouchableOpacity key={index} style={styles.songCard} onPress={() => playSound(song)}>
                        <Text style={styles.songText}>{song.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FF1879', // Main background color
        paddingVertical: 20, // Add some vertical padding
    },
    gif: {
        width: '100%',
        height: 300,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        marginVertical: 5,
        color: '#FFFFFF', // Adjust for visibility
    },
    slider: {
        width: '80%',
        height: 40,
    },
    duration: {
        color: '#FFFFFF', // Adjust for visibility
        marginVertical: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    controlButton: {
        fontSize: 24,
        color: '#FFFFFF', // Adjust for visibility
        paddingHorizontal: 20,
    },
    libraryTitle: {
        fontSize: 24,
        marginVertical: 10,
        color: '#FFFFFF', // Adjust for visibility
    },
    library: {
        paddingHorizontal: 10,
    },
    songCard: {
        backgroundColor: '#B7005E',
        borderRadius: 10,
        padding: 20,
        marginRight: 10,
        width: 100, // Set a fixed width for the song cards
        height: 100, // Set a fixed height to make them square
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
    },
    songText: {
        color: '#FFFFFF', // Adjust for visibility
    },
});

export default MusicPlayerScreen;
