import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        if (user.emailVerified) {
          navigation.replace('HomeScreen'); // Navigate only if email is verified
        } else {
          Alert.alert('Verification Pending', 'Please verify your email to continue.');
          auth.signOut(); // Log the user out if the email is not verified
        }
      }
    });

    return unsubscribe;
  }, [navigation]);


  const validatePassword = password => {
    return password.length >= 6; // Minimum password length
  };

  const handleSignUp = () => {
    if (!validatePassword(password)) {
      Alert.alert('Password too short', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);

        // Send verification email after sign-up
        sendEmailVerification(user)
          .then(() => {
            Alert.alert('Verification Email Sent', 'Please verify your email before logging in.');
            setIsLoading(false); // Stop loading after sending the email
          })
          .catch(error => {
            setIsLoading(false); // Stop loading in case of error
            Alert.alert('Error', 'Failed to send verification email: ' + error.message);
          });
      })
      .catch(error => {
        setIsLoading(false); // Stop loading in case of error
        if (error.code === 'auth/email-already-in-use') {
          alert('This email is already registered.');
        } else {
          alert(error.message);
        }
      });
  };

  const handleLogin = () => {
    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        if (!user.emailVerified) {
          setIsLoading(false);
          Alert.alert('Email Verification Pending', 'Please verify your email to continue.');
          return;
        }
        console.log('Logged in with:', user.email);
        navigation.replace('HomeScreen'); // Navigate to HomeScreen on successful login
      })
      .catch(error => {
        setIsLoading(false);
        if (error.code === 'auth/wrong-password') {
          alert('Incorrect password. Please try again.');
        } else if (error.code === 'auth/user-not-found') {
          alert('No user found with this email.');
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Logging In...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.buttonOutlineText}>{isLoading ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A9D0F5', // Lighter color when disabled
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default LoginScreen;
