import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

export default function BottomBar() {
  const navigation = useNavigation();
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  const handleCommentsPress = () => {
    navigation.navigate('Chat');
  };

  const handleUserPress = () => {
    navigation.navigate('Logout');
  };

  const handleHomePress = () => {
    navigation.navigate('HomeScreen'); // Assuming Swipes is the home screen
  };

  const getIconColor = (routeName) => {
    return currentRoute === routeName ? '#4FD0E9' : '#5c5c5c';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleHomePress}>
        <FontAwesome5 name="house-damage" size={27} color={getIconColor('HomeScreen')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="chatbubbles-sharp" size={30} color={getIconColor('Chat')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUserPress}>
        <FontAwesome name="user" size={27} color={getIconColor('Logout')} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 15,
    shadowColor: '#333333',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 5.46,
    elevation: 9,
    position: 'absolute', // Fix the position
    bottom: 0, // Align to the bottom
    width: '100%', // Ensure it covers the full width
  },
});
