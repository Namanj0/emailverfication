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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5864',
    paddingTop: 20,
    opacity: 0.89,
  },
  imageContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  matchImage: {
    height: 80,
    width: '100%',
    resizeMode: 'contain',
  },
  matchText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  profilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 5,
  },
  profileImage: {
    height: 128,
    width: 128,
    borderRadius: 64,
  },
  button: {
    backgroundColor: 'white',
    margin: 5,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MatchedScreen;
//thisone
