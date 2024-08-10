import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.matchImage} source={{ uri: 'https://qph.cf2.quoracdn.net/main-qimg-e56f7a288554902c6e07186434e88a02' }} />
      </View>
      <Text style={styles.matchText}>
        You and {userSwiped.displayName} have liked each other.
      </Text>
      <View style={styles.profilesContainer}>
        <Image source={{ uri: loggedInProfile.photoURL }} style={styles.profileImage} />
        <Image source={{ uri: userSwiped.photoURL }} style={styles.profileImage} />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('Chat');
        }}
      >
        <Text style={styles.buttonText}>Send a Message</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('HomeScreen');
        }}
      >
        <Text style={styles.buttonText}>Keep Swiping!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5864',
    paddingTop: 20,
    opacity: 0.95,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center', // Center the match image
    paddingHorizontal: 10,
    paddingTop: 30, // Added extra padding for better spacing
  },
  matchImage: {
    height: 100, // Increased size for better visibility
    width: '80%', // Slightly reduced width for better centering
    resizeMode: 'contain',
  },
  matchText: {
    color: 'white',
    fontWeight: '800', // Made text bolder
    fontSize: 22, // Increased font size
    textAlign: 'center',
    marginTop: 20, // Increased margin for better spacing
  },
  profilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20, // Increased margin for better spacing
  },
  profileImage: {
    height: 140, // Slightly larger profile images
    width: 140, // Maintain square aspect ratio
    borderRadius: 70, // Make the profile images circular
    borderWidth: 4, // Added border for emphasis
    borderColor: '#fff', // White border around profile images
    shadowColor: '#000', // Add shadow for a 3D effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // Elevation for Android shadow
  },
  button: {
    backgroundColor: 'white',
    margin: 10, // Increased margin for better spacing
    paddingHorizontal: 30, // Increased padding for a more prominent button
    paddingVertical: 18, // Increased padding for better touch targets
    borderRadius: 30,
    marginTop: 25, // Increased margin for spacing
    shadowColor: '#000', // Added shadow for button
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Elevation for Android shadow
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18, // Increased font size for readability
    color: '#FF5864', // Matched button text color with the theme
  },
});

export default MatchedScreen;
