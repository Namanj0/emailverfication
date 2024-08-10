import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

const universityData = [
  { label: 'Naman Uni', value: '1' },
  { label: 'Chirag Uni', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const ageData = [
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
];

const genderData = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState('');
  const [occupation, setOccupation] = useState('');
  const [age, setAge] = useState(null);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState(null);
  const [gender, setGender] = useState(null);

  const incomplete = !image || !occupation || !age || !name || !university || !gender;

  const goToLifestyleScreen = () => {
    if (incomplete) {
      Alert.alert('Error!', 'Please fill out all fields.');
      return;
    }
    navigation.navigate('LifestyleScreen', {
      userProfile: {
        id: user.uid,
        displayName: name,
        photoURL: image || 'default_image_url', // Replace with your default image URL if needed
        occupation,
        age,
        university: university.label,
        gender,
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, color: 'gray', padding: 10, fontWeight: 'bold' }}>
          Welcome {user.displayName}
        </Text>
        <View style={{ alignItems: 'flex-start', width: '100%' }}>
          <Text style={{ padding: 10, fontWeight: 'bold', color: 'red' }}>
            Display Name
          </Text>
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
          <Text style={{ padding: 10, fontWeight: 'bold', color: 'red' }}>
            Profile Pic
          </Text>
          <TextInput
            value={image}
            onChangeText={(text) => setImage(text)}
            placeholder="Enter a Profile Pic URL"
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
          <Text style={{ padding: 10, fontWeight: 'bold', color: 'red' }}>
            Phone Number
          </Text>
          <TextInput
            value={occupation}
            onChangeText={(text) => setOccupation(text)}
            placeholder="Enter your occupation"
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
          <Text style={{ padding: 10, fontWeight: 'bold', color: 'red' }}>
            Your Age
          </Text>
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
          <Text style={{ padding: 10, fontWeight: 'bold', color: 'red' }}>
            The University
          </Text>
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
          <Text style={{ padding: 10, fontWeight: 'bold', color: 'red' }}>
            The Gender
          </Text>
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
          onPress={goToLifestyleScreen}
          style={{
            width: '90%',
            padding: 12,
            borderRadius: 16,
            position: 'absolute',
            bottom: 20,
            backgroundColor: incomplete ? 'gray' : 'red',
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
//this