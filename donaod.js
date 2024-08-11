import { StyleSheet, FlatList, View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Sample color palette matching ModalScreen
const COLORS = {
  primary: '#ff6f61', // Example color for selected items
  secondary: '#eeeeee', // Example color for background and unselected items
  textPrimary: '#333333', // Example color for text
  textSecondary: '#ffffff', // Example color for text on selected items
  buttonDisabled: '#b0bec5', // Example color for disabled button
  buttonActive: '#ff6f61', // Example color for active button
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
  const [data, setData] = useState(questions);
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = route.params;

  const onSelect = (questionId, optionIndex) => {
    const newData = data.map((question) => {
      if (question.id === questionId) {
        const selectedCount = question.options.filter((option) => option.selected).length;

        if (question.maxSelection === 3) {
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
    setData(newData);
  };

  const isAllQuestionsAnswered = () => {
    return data.every((question) =>
      question.options.some((option) => option.selected)
    );
  };


  const handleContinue = () => {
    if (isAllQuestionsAnswered()) {
      updateUserProfile();
    } else {
      Alert.alert("Please answer all questions before continuing.");
    }
  };

  const renderQuestion = ({ item: question }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.question}</Text>
      <FlatList
        data={question.options}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.item, item.selected && styles.selectedItem]}
            onPress={() => onSelect(question.id, index)}
          >
            <Text style={[styles.itemText, item.selected && styles.selectedItemText]}>{item.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Lifestyle Preferences</Text>
      <View style={styles.underline} />
      <FlatList
        data={data}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={[styles.button, !isAllQuestionsAnswered() && styles.buttonDisabled]} onPress={handleContinue} disabled={!isAllQuestionsAnswered()}>
        <Text style={styles.buttonText}>cont</Text>
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
  questionContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.textPrimary,
    textAlign: 'left',
  },
  row: {
    justifyContent: 'flex-start',
  },
  item: {
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
    backgroundColor: COLORS.secondary,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  selectedItem: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  selectedItemText: {
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
  underline: {
    height: 2,
    backgroundColor: COLORS.primary,
    marginBottom: 10,
  },
});

export default LifestyleScreen;
