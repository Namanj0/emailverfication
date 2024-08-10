import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, Switch, ScrollView, SafeAreaView } from 'react-native';
import { auth } from '../firebase';
import Header from '../components/Header';
import BottomBar from '../components/BottomBar';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const LogoutScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            auth.currentUser
              .delete()
              .then(() => {
                navigation.replace('Login');
              })
              .catch((error) => alert(error.message));
          },
        },
      ]
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(previousState => !previousState);
  };

  // Extract the images parameter from the route
  const { images } = route.params || { images: [null, null, null, null] };

  // Handle cases where images might be undefined or empty
  const profilePic = images[0] || null;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.profilePicContainer}
            onPress={() => navigation.navigate('ImageUploadScreen')}
          >
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
            ) : (
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' }} // Placeholder image URL
                style={styles.profilePic}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.emailText}>{auth.currentUser?.email}</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Modal')} style={styles.button}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ChangePasswordScreen')} style={styles.button}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={styles.button}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Preferences</Text>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
              />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('LanguageScreen')} style={styles.button}>
              <Text style={styles.buttonText}>Change Language</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBarContainer}>
        <BottomBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4', // Light gray background
  },
  scrollViewContent: {
    padding: 5,
    paddingBottom: 80,
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#0095F6', // Coral color border
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0', // Light gray background
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  emailText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    fontWeight: 'bold', // Make email bold
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#0095F6',
    borderWidth: 1,
    borderColor: '#0077CC', // Darker blue border
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF4B5C', // Red color for delete
    borderWidth: 1,
    borderColor: '#CC0000', // Darker red border
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  preferenceText: {
    fontSize: 16,
  },
  bottomBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default LogoutScreen;
