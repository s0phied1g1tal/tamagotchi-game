import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';

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
        <View style={styles.container}>
            {/* Logo Image */}
            <Image source={require('../assets/logo.png')} style={styles.logo} />

            {/* GIF Image */}
            <Image
                source={require('../assets/kirby.gif')} // Replace with your GIF file
                style={styles.gif}
            />

            {/* Hunger and Fun Bars */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBarContainer}>
                    <Text style={styles.progressText}>Hunger</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${hunger}%` }]} />
                    </View>
                </View>

                <View style={styles.progressBarContainer}>
                    <Text style={styles.progressText}>Fun</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${fun}%` }]} />
                    </View>
                </View>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={navigateToMusicPlayerScreen}>
                    <Text style={styles.buttonText}>Go to Music Player</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={navigateToFeedingScreen}>
                    <Text style={styles.buttonText}>Go to Feeding Screen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Adjust to move content higher
        alignItems: 'center',
        backgroundColor: '#FF1879',
        paddingTop: 20, // Adjust for some space at the top
    },
    logo: {
        width: 200, // Adjust this to the size of your logo
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20, // Adds space between logo and GIF
    },
    gif: {
        width: 400, // Adjust this to your GIF size
        height: 300, // Adjust this to your GIF size
        marginBottom: 20, // Adds space between GIF and progress bars
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%', // Adjust based on your layout preference
        marginBottom: 20, // Space between progress bars and buttons
    },
    progressBarContainer: {
        width: '45%', // Adjust to give enough space
    },
    progressBar: {
        height: 20,
        backgroundColor: '#D3D3D3', // Light gray for the background
        borderRadius: 10,
        overflow: 'hidden', // Ensures the fill does not exceed the border
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#D13F5C', // Same color for consistency
    },
    progressText: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20, // Space below the buttons
    },
    button: {
        backgroundColor: '#D13F5C', // Same color as the progress fill
        borderRadius: 10,
        padding: 15,
        width: '48%', // Adjust to fit both buttons
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MainScreen;
