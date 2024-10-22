import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MainScreen = ({ navigation }) => {
    const [hunger, setHunger] = useState(100);
    const [fun, setFun] = useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setHunger(prev => Math.max(prev - 5, 0));
            setFun(prev => Math.max(prev -2, 0));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const getHungerBarColor = () => {
        if (hunger < 20) return 'red';
        if (hunger < 50) return 'orange';
        return '#B7005E'; 
    };

    const getFunBarColor = () => {
        if (fun < 20) return 'red';
        if (fun < 50) return 'orange';
        return '#B7005E'; 
    };

    const navigateToMusicPlayerScreen = () => {
        navigation.navigate('MusicPlayerScreen', { setFun });
    };

    const navigateToFeedingScreen = () => {
        navigation.navigate('FeedingScreen', { hunger, setHunger });
    };

    return (
        <LinearGradient 
            colors={['#FF1879', '#FF1879']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Image source={require('../assets/kirby.gif')} style={styles.gif} />

            <View style={styles.progressContainer}>
                <View style={styles.progressBarContainer}>
                    <Text style={styles.progressText}>Hunger</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${hunger}%`, backgroundColor: getHungerBarColor() }]} />
                    </View>
                    <Text style={styles.progressValue}>{hunger}%</Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <Text style={styles.progressText}>Fun</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${fun}%`, backgroundColor: getFunBarColor() }]} />
                    </View>
                    <Text style={styles.progressValue}>{fun}%</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={navigateToMusicPlayerScreen}>
                    <Text style={styles.buttonText}>Music Player</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={navigateToFeedingScreen}>
                    <Text style={styles.buttonText}>Feeding Game</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
    },
    logo: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 50,
    },
    gif: {
        width: 400,
        height: 300,
        marginBottom: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20,
    },
    progressBarContainer: {
        width: '45%',
    },
    progressBar: {
        height: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    progressText: {
        fontFamily: 'Cherry Bomb One',
        color: '#FFFFFF',
        textAlign: 'left',
        marginBottom: 5,
    },
    progressValue: {
        fontFamily: 'Cherry Bomb One',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#B7005E',
        borderRadius: 10,
        padding: 15,
        width: '48%',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Cherry Bomb One',
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default MainScreen;
