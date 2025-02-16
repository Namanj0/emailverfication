import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

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
    navigation.navigate('HomeScreen');
  };

  const handleFeaturesPress = () => {
    navigation.navigate('FeaturesScreen');
  };

  const getIconColor = (routeName) => {
    return currentRoute === routeName ? '#03A9F4' : '#5c5c5c';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleHomePress}>
        <FontAwesome5 name="house-damage" size={30} color={getIconColor('HomeScreen')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCommentsPress}>
        <Ionicons name="chatbubbles-sharp" size={30} color={getIconColor('Chat')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFeaturesPress}>
        <MaterialIcons name="apps" size={30} color={getIconColor('FeaturesScreen')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUserPress}>
        <FontAwesome name="user" size={30} color={getIconColor('Logout')} />
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
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
