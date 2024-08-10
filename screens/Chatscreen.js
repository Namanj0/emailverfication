import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ChatList from '../components/ChatList';
import BottomBar from '../components/BottomBar';

const Chatscreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chat" />
      <ChatList />
      <BottomBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust the background color as needed
  },
});

export default Chatscreen;
