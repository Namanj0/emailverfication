import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

const ReceiverMessage = ({ message }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: message.photoURL }}
        style={styles.image}
      />
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{message.message}</Text>
        <Text style={styles.timestamp}>{new Date(message.timestamp?.toDate()).toLocaleTimeString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    marginLeft: 8,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageBox: {
    backgroundColor: '#ECECEC',
    borderRadius: 16,
    borderTopLeftRadius: 0,
    paddingHorizontal: 1,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#555',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default ReceiverMessage;
