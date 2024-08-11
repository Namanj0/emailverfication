import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const OnboardingScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

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
      onSkip={() => navigation.replace("Modal")} // Use navigation
      onDone={() => navigation.replace("Modal")} // Use navigation
      DotComponent={DotComponent}
      pages={[
        {
          backgroundColor: "#f5f5f5",
          title: "Welcome to RoomMate",
          subtitle: "Your new journey to finding the perfect roommate starts here.",
          image: <Ionicons name="home" size={100} color="#007bff" />, // Home icon
        },
        {
          backgroundColor: "#e0f7fa",
          title: "Swipe, Match, Connect",
          subtitle: "Swipe right to like, left to pass, and connect with potential roommates!",
          image: (
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubbles-sharp" size={100} color="#007bff" />
              <Text style={styles.iconText}>Chat & Connect</Text>
            </View>
          ),
        },
        {
          backgroundColor: "#e3f2fd",
          title: "Discover Key Features",
          subtitle: "Explore the app’s unique features designed to make finding a roommate easy.",
          image: (
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={100} color="#007bff" />
              <Text style={styles.iconText}>Key Features</Text>
            </View>
          ),
        },
        {
          backgroundColor: "#fce4ec",
          title: "Ready to Get Started?",
          subtitle: "Sign up and start finding your ideal roommate today!",
          image: (
            <View style={styles.iconContainer}>
              <Ionicons name="person-add" size={100} color="#007bff" />
              <Text style={styles.iconText}>Sign Up</Text>
            </View>
          ),
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
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
