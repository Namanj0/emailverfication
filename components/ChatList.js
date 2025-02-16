import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import ChatRow from './ChatRow';

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = onSnapshot(
        query(collection(db, 'matches'), where('usersMatched', 'array-contains', user.uid)),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      );

      return unsubscribe; // Unsubscribe from the listener on component unmount
    }
  }, [user]);

  if (!user) {
    return (
      <View style={styles.noMatchesContainer}>
        <Text style={styles.noMatchesText}>Loading...</Text>
      </View>
    );
  }

  return matches.length > 0 ? (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
      contentContainerStyle={styles.flatListContainer}
      showsVerticalScrollIndicator={false}
    />
  ) : (
    <View style={styles.noMatchesContainer}>
      <Text style={styles.noMatchesText}>No matches at the moment 😢</Text>
      <TouchableOpacity
        style={styles.abutton}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('HomeScreen');
        }}
      >
        <Text style={styles.another}>Keep Swiping!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMatchesText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
  },
  another: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  abutton: {
    backgroundColor: '#03A9F4',
    margin: 10,
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default ChatList;
