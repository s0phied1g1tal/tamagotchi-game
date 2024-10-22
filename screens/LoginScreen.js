import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Track if it's login or sign-in

  const handleSubmit = async () => {
    try {
      const url = isLogin 
          ? 'http://10.150.192.104:5000/tamagotchi/login' 
          : 'http://10.150.192.104:5000/tamagotchi/create';

      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }), 
      });

      if (!response.ok) {
          throw new Error(isLogin ? 'Login failed' : 'Account creation failed');
      }

      const data = await response.json();
      console.log(data);
      Alert.alert('Success', isLogin ? 'Logged in successfully!' : 'Account created successfully!');
      navigation.navigate('MainScreen'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message); 
    }
  };

  return (
    
    <View style={styles.container}>

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
