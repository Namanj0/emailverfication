import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Ionicons } from "@expo/vector-icons";
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
          backgroundColor: "#03A9F4", // DodgerBlue background
          title: "Welcome to RoomMate",
          subtitle: "Your new journey to finding the perfect roommate starts here.",
          image: <Ionicons name="home" size={100} color="#FFFFFF" />, // White icon
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
        },
        {
          backgroundColor: "#03A9F4", // DodgerBlue background
          title: "Swipe, Match, Connect",
          subtitle: "Swipe right to like, left to pass, and connect with potential roommates!",
          image: (
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubbles-sharp" size={100} color="#FFFFFF" />

            </View>
          ),
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
        },
        {
          backgroundColor: "#03A9F4", // DodgerBlue background
          title: "Discover Key Features",
          subtitle: "Explore the app’s unique features designed to make finding a roommate easy.",
          image: (
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={100} color="#FFFFFF" />

            </View>
          ),
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
        },
        {
          backgroundColor: "#03A9F4", // DodgerBlue background
          title: "Ready to Get Started?",
          subtitle: "Sign up and start finding your ideal roommate today!",
          image: (
            <View style={styles.iconContainer}>
              <Ionicons name="person-add" size={100} color="#FFFFFF" />

            </View>
          ),
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
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
    elevation: 3,
  },
  dotContainerSelected: {
    borderColor: '#FFFFFF', // White border for selected dot
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d4d4d4',
  },
  dotSelected: {
    backgroundColor: '#FFFFFF', // White color for selected dot
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  iconText: {
    marginTop: 5,
    fontSize: 18,
    color: '#FFFFFF', // White text
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White title text
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF', // White subtitle text
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});

export default OnboardingScreen;
