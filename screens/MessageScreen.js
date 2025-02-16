import { useRoute } from '@react-navigation/native';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import ReceiverMessage from '../components/ReceiverMessage';
import SenderMessage from '../components/SenderMessage';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [userHasConfirmed, setUserHasConfirmed] = useState(false);
  const [bothConfirmed, setBothConfirmed] = useState(false);
  const [otherUserConfirmed, setOtherUserConfirmed] = useState(false);
  const [reportMessage, setReportMessage] = useState(''); // State for report message
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state

  const otherUserId = Object.keys(matchDetails.users).find((id) => id !== user.uid);

  // Fetch messages from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
    return unsubscribe;
  }, [matchDetails]);

  // Listen for confirmation status from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'matches', matchDetails.id), (doc) => {
      const data = doc.data();
      const roommateConfirmed = data?.roommateConfirmed || {};

      // Update local state based on Firestore data
      setUserHasConfirmed(roommateConfirmed[user.uid] || false);
      setOtherUserConfirmed(roommateConfirmed[otherUserId] || false);

      // If both users have confirmed, set bothConfirmed to true
      setBothConfirmed(
        roommateConfirmed[user.uid] && roommateConfirmed[otherUserId]
      );
    });
    return unsubscribe;
  }, [matchDetails, user]);

  // Send a message to Firestore
  const sendMessage = async () => {
    if (input.trim() === '') return; // Prevent sending empty messages

    const { displayName, photoURL } = matchDetails.users[user.uid] || {};

    try {
      await addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
        timestamp: serverTimestamp(),
        userId: user.uid,
        displayName: displayName || 'Anonymous',
        photoURL: photoURL || 'default-photo-url',
        message: input.trim(),
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Confirm roommate status in Firestore
  const confirmRoommate = () => {
    Alert.alert(
      'Confirm Roommate',
      'Once confirmed, this action cannot be undone',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const confirmationField = `roommateConfirmed.${user.uid}`;
              await updateDoc(doc(db, 'matches', matchDetails.id), {
                [confirmationField]: true,
              });
            } catch (error) {
              console.error('Error confirming roommate:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };


  // Report user function
  const reportUser = async () => {
    try {
      await addDoc(collection(db, 'reports'), {
        reporterId: user.uid,
        reportedId: otherUserId,
        reportMessage: reportMessage, // Include report message
        timestamp: serverTimestamp(),
      });
      Alert.alert('User Reported', 'Thank you for reporting. We will review this issue.');
      setReportMessage(''); // Clear report message after submitting
      setModalVisible(false); // Close modal
    } catch (error) {
      console.error('Error reporting user:', error);
    }
  };

  // Show options to report user
  const showUserOptions = () => {
    Alert.alert(
      'User Options',
      'What would you like to do?',
      [
        { text: 'Report User', onPress: () => setModalVisible(true) }, // Open report modal
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        callEnable
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
      />
      <TouchableOpacity style={styles.optionsButton} onPress={showUserOptions}>
        <MaterialIcons name="more-vert" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            style={styles.messageList}
            keyExtractor={(item) => item.id}
            inverted
            renderItem={({ item }) =>
              item.userId === user.uid ? (
                <SenderMessage key={item.id} message={item} />
              ) : (
                <ReceiverMessage key={item.id} message={item} />
              )
            }
          />
        </TouchableWithoutFeedback>

        {!bothConfirmed ? (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmRoommate}
            disabled={userHasConfirmed}
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text style={styles.confirmButtonText}>
              {userHasConfirmed
                ? otherUserConfirmed
                  ? 'Waiting for Both Confirmations'
                  : 'Waiting for Other User'
                : 'Confirm Roommate'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.confirmedText}>✅ Roommates Confirmed</Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message"
            onChangeText={setInput}
            value={input}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Report Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)} // Close modal on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report User</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type your report message here"
              value={reportMessage}
              onChangeText={setReportMessage}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={reportUser} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Submit Report</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  optionsButton: { position: 'absolute', right: 10, top: 65 },
  keyboardAvoidingView: { flex: 1 },
  messageList: { paddingHorizontal: 10, paddingBottom: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white' },
  textInput: { flex: 1, height: 40, borderRadius: 20, borderWidth: 1, paddingHorizontal: 15, marginRight: 10 },
  sendButton: { backgroundColor: '#128C7E', padding: 10, borderRadius: 20 },
  confirmButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#34a853', padding: 10, borderRadius: 20, },
  confirmButtonText: { color: 'white', marginLeft: 5 },
  confirmedText: { color: 'green', textAlign: 'center', margin: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { backgroundColor: '#128C7E', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5 },
  modalButtonText: { color: 'white', textAlign: 'center' },
});

export default MessageScreen;
