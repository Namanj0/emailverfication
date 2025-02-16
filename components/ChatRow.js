import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    if (matchDetails?.users) {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }
  }, [matchDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'matches', matchDetails.id, 'messages'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message || '')
      ),
    [matchDetails.id, db]
  );

  // Use the first image in the images array or fallback to profilePicture if images array is empty
  const profileImage = matchedUserInfo?.images && matchedUserInfo.images.length > 0
    ? matchedUserInfo.images[0]
    : matchedUserInfo?.profilePicture;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('Message', { matchDetails })
      }
    >
      <Image
        source={{ uri: profileImage }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.displayName}>{matchedUserInfo?.displayName}</Text>
        <Text style={styles.lastMessage}>{lastMessage || 'Say hi to your new roomie!'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginHorizontal: 8,
    marginVertical: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    height: 64,
    width: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ChatRow;
