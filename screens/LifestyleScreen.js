import { StyleSheet, FlatList, View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Checkbox from 'expo-checkbox';
import Slider from '@react-native-community/slider';
import { db } from '../firebase';

const COLORS = {
  primary: '#03A9F4',
  secondary: '#eeeeee',
  textPrimary: '#333333',
  textSecondary: '#ffffff',
  buttonDisabled: '#b0bec5',
  buttonActive: '#1E90FF',
};

// Define labels for cleanliness and noise levels
const cleanlinessLabels = [
  "Nah... I’m a Mess",  // 1
  "It’s a Disaster Zone", // 2
  "Clean-ish",  // 3
  "I Can’t Find the Floor", // 4
  "Not Bad, Not Great", // 5
  "Kinda Clean, But Not Really", // 6
  "Clean Enough to Post a Pic", // 7
  "Neat Freak Mode Activated", // 8
  "Everything’s Sparkling", // 9
  "OCD Level Clean" // 10
];

const noiseLabels = [
  "Shh... Whispering", // 1
  "Can Hear My Thoughts", // 2
  "I’m More of a Silent Movie", // 3
  "Talking Softly", // 4
  "Normal Talk, Not a Party", // 5
  "Slightly Louder Than I Should Be", // 6
  "Music Is My Mood", // 7
  "Neighbors Are Complaining", // 8
  "I’m Basically a DJ", // 9
  "Speakers Full Blast" // 10
];

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
  {
    id: 5,
    question: "Cleanliness",
    type: "slider",
    value: 5,
    min: 1,
    max: 10,
  },
  {
    id: 6,
    question: "Noise Level",
    type: "slider",
    value: 5,
    min: 1,
    max: 10,
  },
];

const LifestyleScreen = () => {
  const [data, setData] = useState(questions);
  const navigation = useNavigation();
  const route = useRoute();
  const [isHonestChecked, setIsHonestChecked] = useState(false);
  const { userProfile } = route.params;

  const onSelect = (questionId, optionIndex) => {
    const newData = data.map((question) => {
      if (question.id === questionId) {
        const selectedCount = question.options.filter((option) => option.selected).length;

        if (question.maxSelection === 1) {
          return {
            ...question,
            options: question.options.map((option, index) => (index === optionIndex ? { ...option, selected: !option.selected } : { ...option, selected: false })),
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

  const onSliderChange = (questionId, value) => {
    const newData = data.map((question) =>
      question.id === questionId ? { ...question, value } : question
    );
    setData(newData);
  };

  const isAllQuestionsAnswered = () => {
    return data.every((question) =>
      question.type === "slider" ? question.value !== null : question.options.some((option) => option.selected)
    );
  };

  const handleContinue = async () => {
    if (isAllQuestionsAnswered() && isHonestChecked) {
      try {
        const updatedLifestyle = data.reduce((acc, question) => {
          if (question.type === "slider") {
            acc[question.question] = question.value;
          } else {
            const selectedOption = question.options.find((option) => option.selected);
            if (selectedOption) {
              acc[question.question] = selectedOption.label;
            }
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
      Alert.alert("Please answer all questions and confirm your honesty before continuing.");
    }
  };

  const renderQuestion = ({ item: question }) => {
    if (question.type === "slider") {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
          <Slider
            style={styles.slider}
            minimumValue={question.min}
            maximumValue={question.max}
            step={1}
            value={question.value}
            onValueChange={(value) => onSliderChange(question.id, value)}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor="#ddd"
            thumbTintColor={COLORS.primary}
          />
          <Text style={styles.sliderValue}>Selected: {question.question === "Cleanliness" ? cleanlinessLabels[question.value - 1] : noiseLabels[question.value - 1]}</Text>
        </View>
      );
    }

    return (
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
  };

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
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isHonestChecked}
          onValueChange={setIsHonestChecked}
          style={styles.checkbox}
        />
        <Text style={styles.checkboxLabel}>I confirm that all my answers are honest.</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, !isAllQuestionsAnswered() || !isHonestChecked ? styles.buttonDisabled : styles.buttonActive]}
        onPress={handleContinue}
        disabled={!isAllQuestionsAnswered() || !isHonestChecked}
      >
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
    marginTop: 100,
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
  slider: {
    width: '100%',
    height: 40,
    marginTop: 10,
  },
  sliderValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 5,
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
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectedItemText: {
    color: COLORS.textSecondary,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  underline: {
    height: 3,
    width: '40%',
    backgroundColor: COLORS.primary,
    marginBottom: 30,
  },
});

export default LifestyleScreen;
