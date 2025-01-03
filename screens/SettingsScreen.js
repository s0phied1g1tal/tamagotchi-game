import React, { useState } from 'react';
import { View, Text, Switch, Button } from 'react-native';

const SettingsScreen = () => {
  const [sound, setSound] = useState(true); // Example state
  const [notifications, setNotifications] = useState(true); // Example state

  const handleSoundChange = async () => {
    try {
      const response = await fetch('http://192.168.129.6:5000/tamagotchi/settings', { // Update the URL to /api/settings
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soundPreference: sound ? 'on' : 'off',
          notificationPreference: notifications ? 'enabled' : 'disabled',
        }),
      });
  
      // Check if response is JSON before parsing
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Settings updated:', data);
      } else {
        const errorText = await response.text(); // Get the text if it's not JSON
        console.error('Response is not JSON:', errorText);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };
  

  return (
    <View>
      <Text>Sound: {sound ? 'On' : 'Off'}</Text>
      <Switch value={sound} onValueChange={() => setSound(!sound)} />
      
      <Text>Notifications: {notifications ? 'Enabled' : 'Disabled'}</Text>
      <Switch value={notifications} onValueChange={() => setNotifications(!notifications)} />

      <Button title="Save Settings" onPress={handleSoundChange} />
    </View>
  );
};

export default SettingsScreen;
