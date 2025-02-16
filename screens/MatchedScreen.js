import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;

  // Get images or default to profilePicture if images array is empty
  const loggedInProfileImages = loggedInProfile.images && loggedInProfile.images.length > 0
    ? loggedInProfile.images
    : [loggedInProfile.profilePicture];

  const userSwipedImages = userSwiped.images && userSwiped.images.length > 0
    ? userSwiped.images
    : [userSwiped.profilePicture];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.matchImage} source={require('../assets/images/match.png')} />
      </View>
      <Text style={styles.matchText}>
        You and {userSwiped.displayName} are ready to be roomies!
      </Text>
      <View style={styles.profilesContainer}>
        {loggedInProfileImages.slice(0, 1).map((imageUri, index) => (
          <Image key={`loggedInProfileImage-${index}`} source={{ uri: imageUri }} style={styles.profileImage} />
        ))}
        {userSwipedImages.slice(0, 1).map((imageUri, index) => (
          <Image key={`userSwipedImage-${index}`} source={{ uri: imageUri }} style={styles.profileImage} />
        ))}
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
    backgroundColor: '#03A9F4',
    paddingTop: 20,
    opacity: 0.95,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  matchImage: {
    height: 100,
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 19,
  },
  matchText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
  },
  profilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  profileImage: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  button: {
    backgroundColor: 'white',
    margin: 10,
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#03A9F4',
  },
});

export default MatchedScreen;
