import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(''); // Add state for email
  const [userName, setUserName] = useState(''); // Add state for username during sign-up
  const [password, setPassword] = useState(''); // Add state for password
  const [isLogin, setIsLogin] = useState(true); // Track if it's login or sign-in

  // This function runs after a successful login
  const handleLogin = async (userData) => {
    try {
      const { userId, email, userName } = userData.user;

      // Ensure all required fields are present
      if (!userId || !email || !userName) {
        console.error('Invalid user data:', userData);
        return;
      }

      // Store in AsyncStorage
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('userName', userName);

      // Verify values are stored
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedUserName = await AsyncStorage.getItem('userName');
      console.log('Stored values:', { storedUserId, storedEmail, storedUserName });

      console.log('User data stored in AsyncStorage');
      navigation.navigate('ProfileScreen');
    } catch (error) {
      console.error('Error storing data in AsyncStorage:', error);
    }
  };

  const handleSubmit = async () => {
    console.log('Submit triggered');

    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    if (!isLogin && !userName) {
      Alert.alert('Error', 'Username is required for sign up.');
      return;
    }

    try {
      const url = isLogin
        ? 'http://192.168.129.6:5000/tamagotchi/login'
        : 'http://192.168.129.6:5000/tamagotchi/register';

      console.log('Sending request to:', url);

      const payload = {
        email,
        password,
        ...(isLogin ? {} : { userName }), // Add userName only for registration
      };

      console.log('Payload:', payload);

      const response = await axios.post(url, payload);
      console.log('Response:', response.data);

      if (isLogin) {
        const userData = response.data;
        await handleLogin(userData); // Call handleLogin on successful login
      }

      Alert.alert('Success', isLogin ? 'Logged in successfully!' : 'Account created successfully!');
      navigation.navigate('MainScreen');
    } catch (error) {
      console.log('Error:', error);

      if (error.response) {
        console.log('Error response:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Something went wrong.');
      } else if (error.request) {
        console.log('Error request:', error.request);
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        console.log('Error message:', error.message);
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TextInput
        placeholder="Enter your Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Enter your Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {!isLogin && ( // Only show username field during sign-up
        <TextInput
          placeholder="Enter your Username"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>{isLogin ? 'Create an Account' : 'Back to Login'}</Text>
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
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  input: {
    color: '#6D003F',
    fontFamily: 'Cherry Bomb One',
    height: 50,
    width: '100%',
    borderColor: '#6D003F',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6D003F',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontFamily: 'Cherry Bomb One',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    fontFamily: 'Cherry Bomb One',
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
