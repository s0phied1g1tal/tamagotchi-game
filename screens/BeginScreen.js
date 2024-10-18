import React from 'react';
import { View, Text, Button } from 'react-native';

const BeginScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Tamagotchi Game!</Text>
      <Button
        title="Start"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default BeginScreen;
