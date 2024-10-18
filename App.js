import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BeginScreen from './screens/BeginScreen';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import MusicPlayerScreen from './screens/MusicPlayerScreen';
import FeedingScreen from './screens/FeedingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BeginScreen">
        <Stack.Screen name="BeginScreen" component={BeginScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="MusicPlayerScreen" component={MusicPlayerScreen} />
        <Stack.Screen name="FeedingScreen" component={FeedingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
