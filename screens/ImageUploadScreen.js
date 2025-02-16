import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { storage, db } from '../firebase'; // Import Firestore and Storage
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ImageUploadScreen = () => {
  const [images, setImages] = useState([null, null]); // Only two slots for images
  const [selectedBox, setSelectedBox] = useState(null);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = getAuth().currentUser;
        if (currentUser) {
          setUser(currentUser);
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setImages(userData.images || [null, null]); // Only two slots
          }
        } else {
          console.log('No user is signed in');
        }
      } catch (error) {
        console.error('Error fetching user images:', error);
      }
    };

    fetchUser();
  }, []);

  const pickImage = async (boxIndex) => {
    setSelectedBox(boxIndex);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storageRef = ref(storage, `profileImages/${user?.uid}/image${boxIndex}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        const newImages = [...images];
        newImages[boxIndex] = downloadURL;
        setImages(newImages);

        await setDoc(doc(db, 'users', user?.uid), { images: newImages }, { merge: true });
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload Error', error.message);
      } finally {
        setSelectedBox(null);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await setDoc(
        doc(db, 'users', user?.uid),
        {
          images,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert('Information', 'Your Profile has been updated successfully!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('Error!', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Photos</Text>
      <View style={styles.grid}>
        {images.slice(0, 2).map((image, index) => (
          <TouchableOpacity key={index} style={styles.box} onPress={() => pickImage(index)}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.plusText}>+</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleUpdate}>
        <Text style={styles.continueButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  box: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 30,
    color: '#ccc',
  },
  continueButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    width: '50%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ImageUploadScreen;
