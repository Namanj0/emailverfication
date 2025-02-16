import { StyleSheet, FlatList, View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct
import useAuth from '../hooks/useAuth'; // Ensure this path is correct
import Header from '../components/Header';

const COLORS = {
  primary: '#03A9F4',
  secondary: '#eeeeee',
  textPrimary: '#333333',
  textSecondary: '#ffffff',
  buttonDisabled: '#b0bec5',
  buttonActive: '#1E90FF',
};

const categories = [
  {
    category: "Sports and Fitness",
    options: [
      "Gym", "Football",
      "Cricket"
    ],
  },
  {
    category: "Activities",
    options: [
      "Reading", "Traveling",
    ],
  },
  {
    category: "Social Interests",
    options: [
      "Parties & Social Gatherings", "Volunteering",
    ],
  },
  {
    category: "Games",
    options: [
      "Board Games", "Video Games",
    ],
  },
  {
    category: "Technology",
    options: [
      "VR (Virtual Reality)", "Gadgets",
    ],
  },
  {
    category: "Interests",
    options: [
      "Finance", "Investments",
    ],
  },
];

const HobbiesAndInterestsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customHobby, setCustomHobby] = useState(''); // State for custom hobby
  const minSelection = 4;

  const toggleSelection = (option) => {
    setSelectedOptions(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const handleAddCustomHobby = () => {
    if (customHobby && !selectedOptions.includes(customHobby)) {
      setSelectedOptions(prev => [...prev, customHobby]);
      setCustomHobby(''); // Clear input field after adding
    } else {
      Alert.alert('Warning', 'Hobby is already selected or empty.');
    }
  };

  const handleContinue = async () => {
    if (user) {
      try {
        // Update Firebase with the selected options
        await setDoc(doc(db, 'users', user.uid), {
          hobbiesAndInterests: selectedOptions,
          // Merge with existing data
        }, { merge: true });

        // Navigate to the ImageUploadScreen with selected options
        navigation.navigate('ImageUploadScreen', { selectedOptions });
      } catch (error) {
        Alert.alert('Error', 'Failed to update your hobbies and interests.');
        console.error(error);
      }
    }
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={[styles.option, selectedOptions.includes(item) && styles.selectedOption]}
      onPress={() => toggleSelection(item)}
    >
      <Text style={[styles.optionText, selectedOptions.includes(item) && styles.selectedOptionText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <FlatList
        data={item.options}
        renderItem={renderOption}
        keyExtractor={(option) => option}
        numColumns={3} // Number of columns in the grid
        contentContainerStyle={styles.optionsContainer}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'flex-start', width: '100%', paddingTop: 20, marginRight: 100 }}>
        <Header title="Hobbies & Interest" />
      </View>
      <View style={styles.customHobbyContainer}>
        <TextInput
          style={styles.customHobbyInput}
          placeholder="Add your custom hobby"
          value={customHobby}
          onChangeText={setCustomHobby}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCustomHobby}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.category}
        />
      ) : (
        <Text>No categories available</Text>
      )}
      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: selectedOptions.length >= minSelection ? COLORS.buttonActive : COLORS.buttonDisabled }]}
        onPress={handleContinue}
        disabled={selectedOptions.length < minSelection}
      >
        <Text style={styles.continueButtonText}> Continue (
          {selectedOptions.length}/{minSelection})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HobbiesAndInterestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  customHobbyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  customHobbyInput: {
    flex: 1,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  optionsContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  option: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    flexGrow: 1,
    flexBasis: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  selectedOptionText: {
    color: COLORS.textSecondary,
  },
  continueButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  continueButtonText: {
    color: COLORS.textSecondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
