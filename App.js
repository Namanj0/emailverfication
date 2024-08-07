import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogoutScreen from './screens/LogoutScreen'
import LoginScreen from './screens/LoginScreen';
import Homescreen from './screens/Homescreen';
import { AuthProvider } from './hooks/useAuth';
import Modal from './screens/ModalScreen'
import ModalScreen from './screens/ModalScreen';
import Match from './screens/MatchedScreen';
import MatchedScreen from './screens/MatchedScreen';
import Chat from './screens/Chatscreen'
import Chatscreen from './screens/Chatscreen';
import Message from './screens/MessageScreen';
import MessageScreen from './screens/MessageScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
          <Stack.Screen name="HomeScreen" component={Homescreen} />
          <Stack.Screen name="Modal" component={ModalScreen} />
          <Stack.Screen name="Match" component={MatchedScreen} />
          <Stack.Screen name="Chat" component={Chatscreen} />
          <Stack.Screen name="Message" component={MessageScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
