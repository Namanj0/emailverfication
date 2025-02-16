import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';


const universityData = [
  { label: 'Naman Uni', value: '1' },
  { label: 'Chirag Uni', value: '2' },
  // more options...
];

const ageData = [
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
  // more options...
];

const genderData = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [images, setImages] = useState(['']); // Array to hold multiple image URLs
  const [occupation, setOccupation] = useState('');
  const [age, setAge] = useState(null);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState(null);
  const [gender, setGender] = useState(null);

  const incomplete = !occupation || !age || !name || !university || !gender;

  const saveProfileData = async () => {
    if (incomplete) {
      Alert.alert('Error!', 'Please fill out all fields.');
      return;
    }

    // Save data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName: name,
      occupation,
      age,
      university: university.label,
      gender,
      timestamp: serverTimestamp(),
    });

    navigation.navigate('LifestyleScreen', {
      userProfile: {
        id: user.uid,
        displayName: name,
        occupation,
        age,
        university: university.label,
        gender,
      },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: false,
    });
  }, [navigation]);

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 100, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 30, color: 'gray', padding: 10, fontWeight: 'bold' }}>
          Welcome {user.displayName}
        </Text>
        <View style={{ alignItems: 'flex-start', width: '100%' }}>
          <Text style={{ padding: 10, fontWeight: 'bold', color: '#03A9F4', fontSize: 16, }}>Display Name</Text>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Enter your display name"
            style={{
              fontSize: 20,
              padding: 10,
              marginBottom: 20,
              width: '100%',
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
            }}
          />
          <Text style={{ padding: 10, fontWeight: 'bold', color: '#03A9F4', fontSize: 16 }}>Phone Number</Text>
          <TextInput
            value={occupation}
            onChangeText={(text) => setOccupation(text)}
            placeholder="Enter your Phone Number"
            style={{
              fontSize: 20,
              padding: 10,
              marginBottom: 20,
              width: '100%',
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
            }}
          />
          <Text style={{ padding: 10, fontWeight: 'bold', color: '#03A9F4', fontSize: 16 }}>Your Age</Text>
          <Dropdown
            style={{
              width: '100%',
              marginBottom: 20,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              padding: 10,
            }}
            placeholderStyle={{ fontSize: 16, color: '#999' }}
            selectedTextStyle={{ fontSize: 16, color: '#333' }}
            inputSearchStyle={{ height: 40, fontSize: 16, color: '#333' }}
            data={ageData}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder="Select age"
            value={age}
            onChange={(item) => {
              setAge(item.value);
            }}
          />
          <Text style={{ padding: 10, fontWeight: 'bold', color: '#03A9F4', fontSize: 16 }}>Your University</Text>
          <Dropdown
            style={{
              width: '100%',
              marginBottom: 20,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              padding: 10,
            }}
            placeholderStyle={{ fontSize: 16, color: '#999' }}
            selectedTextStyle={{ fontSize: 16, color: '#333' }}
            inputSearchStyle={{ height: 40, fontSize: 16, color: '#333' }}
            data={universityData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select university"
            searchPlaceholder="Search..."
            value={university}
            onChange={(item) => {
              setUniversity(item);
            }}
          />
          <Text style={{ padding: 10, fontWeight: 'bold', color: '#03A9F4', fontSize: 16 }}>Your Gender</Text>
          <Dropdown
            style={{
              width: '100%',
              marginBottom: 20,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              padding: 10,
            }}
            placeholderStyle={{ fontSize: 16, color: '#999' }}
            selectedTextStyle={{ fontSize: 16, color: '#333' }}
            inputSearchStyle={{ height: 40, fontSize: 16, color: '#333' }}
            data={genderData}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder="Select gender"
            value={gender}
            onChange={(item) => {
              setGender(item.value);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={saveProfileData}
          style={{
            width: '90%',
            padding: 12,
            borderRadius: 16,
            position: 'absolute',
            bottom: 20,
            backgroundColor: incomplete ? 'gray' : '#1E90FF',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ModalScreen;
