import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';

const BeginScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(1)).current; 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1, 
          duration: 1000, 
          useNativeDriver: true, 
        }),
        Animated.timing(logoScale, {
          toValue: 1, 
          duration: 1000, 
          useNativeDriver: true, 
        }),
      ])
    ).start();
  }, [logoScale]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { transform: [{ scale: logoScale }] }]} 
      />
      
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
    width: 300,  
    height: 150,
    resizeMode: 'contain',  
    marginBottom: 50,  
  },
  startButton: {
    backgroundColor: '#6D003F',  
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,  

  },
  buttonText: {
    fontFamily: 'Cherry Bomb One', 
    color: '#FF76AA',
    fontSize: 20,
  },
});

export default BeginScreen;
