import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';

const MusicPlayerScreen = ({ route }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSong, setCurrentSong] = useState(null);
    const { setFun } = route.params;

    const songs = [
        { title: 'ETA', path: require('../assets/audio/ETA.mp3'), cover: require('../assets/images/cover1.jpg') },
        { title: 'Buri Buri', path: require('../assets/audio/BuriBuri.mp3'), cover: require('../assets/images/cover2.jpg') },
        { title: 'Clint Eastwood', path: require('../assets/audio/Clint Eastwood.mp3'), cover: require('../assets/images/cover3.jpg') },
        { title: 'Espresso', path: require('../assets/audio/Espresso.mp3'), cover: require('../assets/images/cover4.jpg') },
        { title: 'TTYL', path: require('../assets/audio/TTYL.mp3'), cover: require('../assets/images/cover5.jpg') },
    ];

    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    const playSound = async (song) => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();  // Make sure to unload the previous sound
            setSound(null);
            setIsPlaying(false);
            setProgress(0);
        }

        try {
            const { sound, status } = await Audio.Sound.createAsync(
                song.path,
                {
                    isLooping: false,
                    shouldPlay: true,
                }
            );

            setSound(sound);
            setCurrentSong(song);
            setDuration(status.durationMillis);
            sound.setOnPlaybackStatusUpdate(updateStatus);
            setIsPlaying(true);
            setFun(prev => Math.min(prev + 5, 100));
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    const updateStatus = (status) => {
        if (status.isLoaded) {
            if (status.isPlaying) {
                setProgress(status.positionMillis);
            }
            if (duration === 0) {
                setDuration(status.durationMillis);
            }
        }
    };

    const pauseSound = async () => {
        await sound.pauseAsync();
        setIsPlaying(false);
    };

    const nextSong = () => {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        setCurrentSongIndex(nextIndex);
        playSound(songs[nextIndex]);
    };

    const previousSong = () => {
        const previousIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        setCurrentSongIndex(previousIndex);
        playSound(songs[previousIndex]);
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
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, sound]);

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync();
        } : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/kirby.gif')}
                style={styles.gif}
                resizeMode="contain"
            />

            <Text style={styles.title}>Now Playing: {currentSong ? currentSong.title : 'Select a song'}</Text>

            <Slider
                style={styles.slider}
                value={progress}
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={async (value) => {
                    if (sound) {
                        await sound.setPositionAsync(value);
                        setProgress(value);
                    }
                }}
                disabled={!isPlaying}
            />

            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{`${Math.floor(progress / 1000)}s`}</Text>
                <Text style={styles.progressText}>{`${Math.floor(duration / 1000)}s`}</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={previousSong}>
                    <Image source={require('../assets/images/previous.png')} style={styles.controlImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={isPlaying ? pauseSound : () => playSound(currentSong)}>
                    <Image source={require('../assets/images/play.png')} style={styles.controlImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={nextSong}>
                    <Image source={require('../assets/images/next.png')} style={styles.controlImage} />
                </TouchableOpacity>
            </View>

            <Text style={styles.libraryTitle}>Library</Text>
            <ScrollView horizontal contentContainerStyle={styles.library}>
                {songs.map((song, index) => (
                    <TouchableOpacity key={index} style={styles.songCard} onPress={() => playSound(song)}>
                        <Image source={song.cover} style={styles.songImage} />
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
        backgroundColor: '#FF1879',
        paddingVertical: 20,
    },
    gif: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        marginVertical: 10,
        color: '#FFFFFF',
    },
    slider: {
        width: '80%',
        height: 40,
        
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 10,
    },
    progressText: {
        color: '#FFFFFF',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    controlImage: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
    },
    libraryTitle: {
        fontSize: 24,
        marginVertical: 10,
        color: '#FFFFFF',
    },
    library: {
        paddingHorizontal: 10,
    },
    songCard: {
        backgroundColor: '#B7005E',
        borderRadius: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 220,  // Set the width to 220
        height: 220, // Set the height to 220
    },
    songImage: {
        width: 220,  // Set the width of the image to fill the card
        height: 220, // Set the height of the image to fill the card
        borderRadius: 10,
    },
});

export default MusicPlayerScreen;
