import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SinglePageOnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our App</Text>
      <Text style={styles.subtitle}>Discover amazing features and get started!</Text>

      <View style={styles.section}>
        <Ionicons name="shield-checkmark" color="#28a745" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.header}>Swipe Safely</Text>
          <Text style={styles.description}>Follow the rules to ensure a safe experience.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Ionicons name="heart-dislike" color="#dc3545" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.header}>Swipe Left to Pass</Text>
          <Text style={styles.description}>Not interested? Swipe left to move on.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Ionicons name="heart" color="#e83e8c" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.header}>Swipe Right to Like</Text>
          <Text style={styles.description}>Found a match? Swipe right to like.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Ionicons name="chatbubbles-sharp" color="#007bff" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.header}>Match and Chat</Text>
          <Text style={styles.description}>Start a conversation with your matches!</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.replace('HomeScreen')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginLeft: 10,
  },
  icon: {
    marginRight: 20,
    fontSize: 50,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 18,
    color: '#666',
  },
  button: {
    width: '90%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'red',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default SinglePageOnboardingScreen;
