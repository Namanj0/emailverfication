import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, SafeAreaView, ScrollView } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import BottomBar from '../components/BottomBar';
import * as Sharing from 'expo-sharing';
import { Linking } from 'react-native';
import { FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';

const handleWhatsApp = () => {
  const phoneNumber = '+1234567890';
  const message = encodeURIComponent("Hi, I'm reaching out from your app.");
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  Linking.openURL(url).catch(() => {
    alert('WhatsApp is not installed on this device.');
  });
};

const LogoutScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const imageUrl = data.images.find(image => image !== null);
          setProfilePic(imageUrl || null);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    if (isFocused) {
      fetchProfilePic();
    }
  }, [isFocused]);

  const handleSignOut = () => {
    auth.signOut()
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
            auth.currentUser.delete()
              .then(() => {
                navigation.replace('Login');
              })
              .catch((error) => alert(error.message));
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Sharing is not available on this platform');
      return;
    }

    try {
      await Sharing.shareAsync('https://your-app-url.com', {
        dialogTitle: 'Share App',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

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
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' }}
                style={styles.profilePic}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.emailText}>{auth.currentUser?.email}</Text>
          <View style={styles.section}>
            <TouchableOpacity onPress={() => navigation.navigate('ImageUploadScreen')} style={styles.button}>
              <FontAwesome5 name="user-edit" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Update Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={styles.button}>
              <Feather name="log-out" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
              <MaterialIcons name="delete" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <FontAwesome5 name="share-alt" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Share App</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsappButton}>
              <FontAwesome5 name="phone" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Talk to the Founder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  scrollViewContent: { padding: 5, paddingBottom: 80 },
  contentContainer: { alignItems: 'center', padding: 20 },
  profilePicContainer: {
    width: 150, height: 150, borderRadius: 75, overflow: 'hidden', marginBottom: 20, borderWidth: 1.75,  // Adds thickness to the border
    borderColor: 'black',
  },
  profilePic: { width: '100%', height: '100%' },
  emailText: { fontSize: 17, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  section: { width: '100%', backgroundColor: '#FFF', borderRadius: 10, padding: 20, marginBottom: 20 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#03A9F4', borderRadius: 5, padding: 20, marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 19, marginLeft: 10 },
  icon: { marginRight: 10, fontSize: 17, },
  deleteButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#03A9F4', borderRadius: 5, padding: 20 },
  deleteButtonText: { color: '#fff', fontSize: 19, marginLeft: 10 },
  shareButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#03A9F4', borderRadius: 5, padding: 20, marginTop: 10, },
  whatsappButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#03A9F4', borderRadius: 5, padding: 20, marginTop: 10, },
});

export default LogoutScreen;
