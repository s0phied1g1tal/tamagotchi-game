import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Track if it's login or sign-in

  const handleSubmit = async () => {
    try {
      const url = isLogin 
          ? 'http://192.168.129.6:5000/tamagotchi/login' // Login endpoint
          : 'http://192.168.129.6:5000/tamagotchi/create'; // Sign-in endpoint

      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }), // Only send userId for both login and sign-in
      });

      if (!response.ok) {
          throw new Error(isLogin ? 'Login failed' : 'Account creation failed');
      }

      const data = await response.json();
      console.log(data);
      Alert.alert('Success', isLogin ? 'Logged in successfully!' : 'Account created successfully!');
      navigation.navigate('MainScreen'); // Navigate to the main screen
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message); // Show error alert
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TextInput
        placeholder="Enter your User ID"
        value={userId}
        onChangeText={setUserId}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign In"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>{isLogin ? "Create an Account" : "Back to Login"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF1879', // Background color to match your theme
    padding: 20,
  },
  logo: {
    width: 200, // Adjust the size of your logo
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30, // Space between logo and input
  },
  input: {
    height: 50,
    width: '100%', // Full width
    borderColor: '#D13F5C', // Border color
    borderWidth: 2,
    borderRadius: 25, // Rounded corners
    paddingHorizontal: 20, // Padding inside the input
    marginBottom: 15, // Space between input and button
    backgroundColor: '#fff', // Background color for input
  },
  button: {
    backgroundColor: '#D13F5C', // Button color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15, // Space between buttons
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline', // Underline for the toggle text
  },
});

export default LoginScreen;
