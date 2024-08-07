import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const SenderMessage = ({ message }) => {
  return (
    <View style={styles.container}>
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
    justifyContent: 'flex-end',
    marginVertical: 6,
    marginRight: 8,
  },
  messageBox: {
    backgroundColor: '#DCF8C6',
    borderRadius: 16,
    borderTopRightRadius: 0,
    paddingHorizontal: 12,
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

export default SenderMessage;
