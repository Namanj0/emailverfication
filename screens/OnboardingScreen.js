import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { useNavigation } from "@react-navigation/native";

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const DotComponent = ({ selected }) => {
    return (
      <View
        style={[
          styles.dotContainer,
          selected ? styles.dotContainerSelected : null,
        ]}
      >
        <View
          style={[
            styles.dot,
            selected ? styles.dotSelected : null,
          ]}
        />
      </View>
    );
  };

  return (
    <Onboarding
      onSkip={() => navigation.replace("Modal")}
      onDone={() => navigation.replace("Modal")}
      DotComponent={DotComponent}
      pages={[
        {
          backgroundColor: "#fff",
          title: "Welcome to the App",
          subtitle: "Explore the features and enjoy your experience.",
          image: (
            <View style={styles.imageContainer}>
              <View style={styles.imagePlaceholder} />
            </View>
          ),
        },
        {
          backgroundColor: "#fdeb93",
          title: "Discover Features",
          subtitle: "Find out what makes our app unique and useful.",
          image: <View style={styles.imagePlaceholder} /> // Placeholder
        },
        {
          backgroundColor: "#e9bcbe",
          title: "Get Started",
          subtitle: "Let’s get started and make the most of this app!",
          image: <View style={styles.imagePlaceholder} /> // Placeholder
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    width: 16,
    height: 16,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  dotContainerSelected: {
    borderColor: '#ff5a5f',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d4d4d4',
  },
  dotSelected: {
    backgroundColor: '#ff5a5f',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff5a5f',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default OnboardingScreen;
