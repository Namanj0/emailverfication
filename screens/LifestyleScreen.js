import { StyleSheet, FlatList, View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Sample color palette matching ModalScreen
const COLORS = {
  primary: '#ff6f61',
  secondary: '#eeeeee',
  textPrimary: '#333333',
  textSecondary: '#ffffff',
  buttonDisabled: '#b0bec5',
  buttonActive: '#ff6f61',
};

// Existing questions array
const questions = [
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
    question: "Sleeping Habits",
    options: [
      { label: "Early Bird", selected: false },
      { label: "Night Owl", selected: false },
    ],
    minSelection: 1,
    maxSelection: 1,
  },
  {
    id: 3,
    question: "Fitness Habits",
    options: [
      { label: "Daily", selected: false },
      { label: "Often", selected: false },
      { label: "Not for me", selected: false },
    ],
    minSelection: 1,
    maxSelection: 1,
  },
  {
    id: 4,
    question: "Social Habit",
    options: [
      { label: "Introvert", selected: false },
      { label: "Extrovert", selected: false },
      { label: "Ambivert", selected: false },
    ],
    minSelection: 1,
    maxSelection: 1,
  },
];

const LifestyleScreen = () => {
  const [data, setData] = useState(questions);
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = route.params;

  const onSelect = (questionId, optionIndex) => {
    const newData = data.map((question) => {
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
    setData(newData);
  };

  const isAllQuestionsAnswered = () => {
    return data.every((question) =>
      question.options.some((option) => option.selected)
    );
  };

  const handleContinue = async () => {
    if (isAllQuestionsAnswered()) {
      try {
        const updatedLifestyle = data.reduce((acc, question) => {
          const selectedOption = question.options.find((option) => option.selected);
          if (selectedOption) {
            acc[question.question] = selectedOption.label;
          }
          return acc;
        }, {});

        await setDoc(doc(db, 'users', userProfile.id), {
          ...userProfile,
          lifestyle: updatedLifestyle,
          timestamp: serverTimestamp(),
        });

        navigation.navigate('HobbiesAndInterestsScreen');
      } catch (error) {
        Alert.alert('Error!', error.message);
      }
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
        <Text style={styles.buttonText}>Continue</Text>
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
