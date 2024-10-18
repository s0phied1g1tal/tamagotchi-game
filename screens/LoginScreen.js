import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

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
    <View>
      <TextInput
        placeholder="Enter your User ID"
        value={userId}
        onChangeText={setUserId}
      />
      <Button title={isLogin ? "Login" : "Sign In"} onPress={handleSubmit} />
      <Button
        title={isLogin ? "Create an Account" : "Back to Login"}
        onPress={() => setIsLogin(!isLogin)} // Toggle between login and sign-in
      />
    </View>
  );
};

export default LoginScreen;

