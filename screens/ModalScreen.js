import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState('');
  const [occupation, setOccupation] = useState('');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Diet Preference",
      options: [
        { label: "Veg", selected: false },
        { label: "Non-Veg", selected: false },
      ],
      minSelection: 1,
      maxSelection: 1,
    },
    {
      id: 2,
      question: "Alcohol Consumption",
      options: [
        { label: "Frequently", selected: false },
        { label: "Occasionally", selected: false },
        { label: "Never", selected: false },
      ],
      minSelection: 1,
      maxSelection: 1,
    },
    {
      id: 3,
      question: "Smoking Habit",
      options: [
        { label: "Smoker", selected: false },
        { label: "Non-Smoker", selected: false },
      ],
      minSelection: 1,
      maxSelection: 1,
    },
  ]);

  const incomplete = !image || !occupation || !age || !name || !questions.every(question => question.options.some(option => option.selected));

  const updateUserProfile = async () => {
    try {
      const selectedAnswers = questions.map((question) => {
        return {
          question: question.question,
          selectedOption: question.options.find(option => option.selected)?.label || '',
        };
      });

      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        displayName: name,
        photoURL: image || 'default_image_url', // Replace with your default image URL if needed
        occupation,
        age,
        lifestyle: selectedAnswers, // Store selected answers
        timestamp: serverTimestamp(),
      });
      Alert.alert('Information', 'Your profile has been updated successfully!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('Error!', error.message);
    }
  };

  const onSelect = (questionId, optionIndex) => {
    const newQuestions = questions.map((question) => {
      if (question.id === questionId) {
        const selectedCount = question.options.filter((option) => option.selected).length;

        if (question.maxSelection === 1) {
          return {
            ...question,
            options: question.options.map((option, index) => ({
              ...option,
              selected: index === optionIndex ? !option.selected : false,
            })),
          };
        }

        return {
          ...question,
          options: question.options.map((option, index) => {
            if (index === optionIndex) {
              if (option.selected && selectedCount <= question.minSelection) {
                Alert.alert(`You must select at least ${question.minSelection} option(s).`);
                return option;
              }
              return { ...option, selected: !option.selected };
            }
            return option;
          }),
        };
      }
      return question;
    });
    setQuestions(newQuestions);
  };

  const renderQuestion = ({ item: question }) => (
    <View style={{ marginBottom: 20, marginTop: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign: 'left' }}>
        {question.question}
      </Text>
      <FlatList
        data={question.options}
        renderItem={({ item, index }) => (
          <TouchableWithoutFeedback onPress={() => onSelect(question.id, index)}>
            <View
              style={[
                {
                  width: '30%',
                  height: 50,
                  padding: 10,
                  marginVertical: 10,
                  marginHorizontal: '1.5%',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: item.selected ? '#03a9f4' : 'white',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 5,
                },
              ]}
            >
              <Text style={{ fontSize: 16, color: item.selected ? 'white' : '#333', textAlign: 'center' }}>
                {item.label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        contentContainerStyle={{ justifyContent: 'flex-start' }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 20 }}>
      <Text style={{ fontSize: 20, color: 'gray', padding: 10, fontWeight: 'bold' }}>
        Welcome {user.displayName}
      </Text>
      <Text style={{ textAlign: 'center', padding: 10, fontWeight: 'bold', color: 'red' }}>
        Step 1: The Display Name
      </Text>
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="Enter your display name"
        style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }}
      />
      <Text style={{ textAlign: 'center', padding: 10, fontWeight: 'bold', color: 'red' }}>
        Step 2: The Profile Pic
      </Text>
      <TextInput
        value={image}
        onChangeText={(text) => setImage(text)}
        placeholder="Enter a Profile Pic URL"
        style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }}
      />
      <Text style={{ textAlign: 'center', padding: 10, fontWeight: 'bold', color: 'red' }}>
        Step 3: The Occupation
      </Text>
      <TextInput
        value={occupation}
        onChangeText={(text) => setOccupation(text)}
        placeholder="Enter your occupation"
        style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }}
      />
      <Text style={{ textAlign: 'center', padding: 10, fontWeight: 'bold', color: 'red' }}>
        Step 4: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        placeholder="Enter your age"
        style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }}
        keyboardType="numeric"
      />
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ justifyContent: 'flex-start' }}
      />
      <TouchableOpacity
        disabled={incomplete}
        onPress={updateUserProfile}
        style={{
          width: 256,
          padding: 12,
          borderRadius: 16,
          position: 'absolute',
          bottom: 20,
          backgroundColor: incomplete ? 'gray' : 'red',
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 20 }}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
//this one