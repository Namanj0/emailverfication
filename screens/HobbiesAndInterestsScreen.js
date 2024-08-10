import { StyleSheet, FlatList, View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct
import useAuth from '../hooks/useAuth'; // Ensure this path is correct

const COLORS = {
  primary: '#ff6f61',
  secondary: '#eeeeee',
  textPrimary: '#333333',
  textSecondary: '#ffffff',
  buttonDisabled: '#b0bec5',
  buttonActive: '#ff6f61',
};

const categories = [
  {
    category: "Sports and Fitness",
    options: [
      "Running", "Cycling", "Swimming", "Gym", "Yoga", "Football", "Tennis",
      "Volleyball", "Basketball", "Squash", "Cricket"
    ],
  },
  {
    category: "Activities",
    options: [
      "Cooking & Baking", "Traveling", "Photography", "Reading"
    ],
  },
  {
    category: "Social Interests",
    options: [
      "Parties & Social Gatherings", "Volunteering", "Networking & Meetups"
    ],
  },
  {
    category: "Games",
    options: [
      "Board Games", "Video Games", "Monopoly", "Fortnite", "FIFA"
    ],
  },
  {
    category: "Technology",
    options: [
      "VR (Virtual Reality)", "Gadgets", "Other Tech Interests"
    ],
  },
  {
    category: "Interests",
    options: [
      "Finance", "Investments", "Coding", "Programming", "Business", "Accounting", "Design"
    ],
  },
];

const HobbiesAndInterestsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleSelection = (option) => {
    setSelectedOptions(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const handleUpdate = async () => {
    if (selectedOptions.length >= 4) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          hobbiesAndInterests: selectedOptions,
          timestamp: serverTimestamp(),
        }, { merge: true }); // Merging to not overwrite existing fields

        Alert.alert('Information', 'Your interests have been updated successfully!');
        navigation.navigate('HomeScreen'); // Navigate to HomeScreen
      } catch (error) {
        Alert.alert('Error!', error.message);
      }
    } else {
      Alert.alert('Warning', 'Please select at least 4 interests.');
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
      <Text style={styles.heading}>Hobbies and Interests</Text>
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.category}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text>No categories available</Text>
      )}
      <TouchableOpacity
        style={[styles.button, selectedOptions.length < 4 && styles.buttonDisabled]}
        onPress={handleUpdate}
        disabled={selectedOptions.length < 4}
      >
        <Text style={styles.buttonText}>Update Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.secondary,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  listContent: {
    justifyContent: 'flex-start',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  option: {
    width: '30%', // Adjust width to fit in multiple columns
    padding: 10,
    margin: '1%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  optionText: {
    fontSize: 12, // Smaller font size for better fitting
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  buttonText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HobbiesAndInterestsScreen;
