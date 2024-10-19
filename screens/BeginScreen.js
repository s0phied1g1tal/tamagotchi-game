import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';

const BeginScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(1)).current; // Create a new Animated value for scaling

  useEffect(() => {
    // Start the animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1, // Scale to 110%
          duration: 1000, // Duration of the scaling
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(logoScale, {
          toValue: 1, // Scale back to original
          duration: 1000, // Duration of the scaling
          useNativeDriver: true, // Use native driver for better performance
        }),
      ])
    ).start();
  }, [logoScale]);

  return (
    <View style={styles.container}>
      {/* Logo Image with Animation */}
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { transform: [{ scale: logoScale }] }]} // Apply the scaling transform
      />
      
      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.buttonText}>START</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF1879',
  },
  logo: {
    width: 300,  // Adjust this to the size of your logo
    height: 150,
    resizeMode: 'contain',  // Makes sure the aspect ratio is maintained
    marginBottom: 50,  // Adds some space between logo and button
  },
  startButton: {
    backgroundColor: '#B7005E',  // Darker pink for the button
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,  // Makes the button rounded
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,  // For Android shadow
  },
  buttonText: {
    fontFamily: 'Cherry Bomb One', // Change this to the actual font family name if necessary
    color: '#FF76AA',
    fontSize: 20,
  },
});

export default BeginScreen;
