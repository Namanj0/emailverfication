import { SafeAreaView, Alert, Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { firebase } from "../firebase";
import * as FileSystem from 'expo-file-system';

const ImageUploadScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("No image selected");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = image.substring(image.lastIndexOf('/') + 1);
      const ref = firebase.storage().ref().child(filename);

      await ref.put(blob);
      setUploading(false);
      Alert.alert("Image uploaded successfully!");
      setImage(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
      Alert.alert("Error uploading image");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image && <Image
          source={{ uri: image }}
          style={styles.image}
        />}
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectButton: {
    width: 150,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',

  },
})

export default ImageUploadScreen