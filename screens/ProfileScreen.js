import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedUserName = await AsyncStorage.getItem('userName');

      if (storedUserId && storedEmail && storedUserName) {
        setUserId(storedUserId);
        setEmail(storedEmail);
        setUserName(storedUserName);
      } else {
        console.error('User data is missing in AsyncStorage');
      }
    } catch (error) {
      console.error('Error loading user data from AsyncStorage', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!userId || !userName || !email) {
      Alert.alert('Error', 'User ID, username, and email are required');
      return;
    }

    try {
      const response = await fetch('http://192.168.129.6:5000/tamagotchi/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
          email,
        }),
        credentials: 'include',
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Error parsing response as JSON:', jsonError);
        throw new Error('Failed to parse response as JSON');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      Alert.alert('Success', data.message || 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your username"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('MainScreen')}  
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.updateButton}  
          onPress={handleUpdateProfile}
        >
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#6D003F',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Cherry Bomb One',
    fontSize: 18,
  },
  updateButton: {
    backgroundColor: '#6D003F',  
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,  
  },
  updateButtonText: {
    color: '#fff',
    fontFamily: 'Cherry Bomb One',
    fontSize: 18,
  },
});

export default ProfileScreen;