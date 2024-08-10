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
import LifestyleScreen from './screens/LifestyleScreen';
import HobbiesAndInterestsScreen from './screens/HobbiesAndInterestsScreen';
import ImageUploadScreen from './screens/ImageUploadScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SinglePageOnboardingScreen from './screens/SinglePageOnboardingScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Logout" component={LogoutScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={Homescreen} options={{ headerShown: false }} />
          <Stack.Screen name="Modal" component={ModalScreen} />
          <Stack.Screen name="LifestyleScreen" component={LifestyleScreen} />
          <Stack.Screen name="HobbiesAndInterestsScreen" component={HobbiesAndInterestsScreen} />
          <Stack.Screen name="Match" component={MatchedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={Chatscreen} options={{ headerShown: false }} />
          <Stack.Screen name="Message" component={MessageScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SinglePageOnboardingScreen" component={SinglePageOnboardingScreen} options={{ headerShown: false }} />



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
