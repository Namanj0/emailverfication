import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import generateId from '../lib/generateId';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const DUMMY_DATA = [
  {
    displayName: 'Jennifer',
    id: '1',
    lastName: 'Aniston',
    occupation: 'Actress',
    age: 22,
    photoURL: 'https://example.com/path-to-jennifer-aniston-image.jpg',
    lifestyle: [
      { question: 'Diet Preference', selectedOption: 'Veg' },
      { question: 'Alcohol Consumption', selectedOption: 'Never' },
      { question: 'Smoking Habit', selectedOption: 'Smoker' }
    ]
  },
  // other dummy data...
];

const Homescreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const swiperRef = useRef();

  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate('Modal');
      }
      return unsub;
    });
  }, [navigation, user.uid]);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );
      const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes')).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );
      const passedUserIds = passes.length > 0 ? passes : ['fallback'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['fallback'];

      const allUserIds = [...passedUserIds, ...swipedUserIds];
      const batchedQueries = [];

      while (allUserIds.length > 0) {
        const batch = allUserIds.splice(0, 10);
        batchedQueries.push(
          query(
            collection(db, 'users'),
            where('id', 'not-in', batch)
          )
        );
      }

      const profilesFromDB = [];
      for (const q of batchedQueries) {
        const snapshot = await getDocs(q);
        snapshot.docs.forEach((doc) => {
          if (doc.id !== user.uid) {
            profilesFromDB.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
      }

      if (profilesFromDB.length === 0) {
        setNoMoreProfiles(true);
      } else {
        setNoMoreProfiles(false);
      }

      setProfiles([...profilesFromDB, ...DUMMY_DATA]); // Include dummy data
    };

    fetchCards();
    return unsub;
  }, [user.uid]);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName}`);
    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];

    const loggedInProfile = (await getDoc(doc(db, 'users', user.uid))).data();

    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log(`Hooray, you MATCHED with ${userSwiped.displayName || userSwiped.firstName}`);
        setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
        setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
          users: {
            [user.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped,
          },
          usersMatched: [user.uid, userSwiped.id],
          timestamp: serverTimestamp(),
        });
        navigation.navigate('Match', {
          loggedInProfile,
          userSwiped,
        });
      } else {
        console.log(`You swiped on ${userSwiped.displayName || userSwiped.firstName}`);
        setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
      }
    });
  };

  const renderCard = (card) => {
    if (!card) {
      return (
        <View style={{ backgroundColor: 'white', height: '65%', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No Profiles Available</Text>
        </View>
      );
    }

    return (
      <View style={{ backgroundColor: 'white', height: '65%', borderRadius: 16 }}>
        <Image
          source={{ uri: card.photoURL || 'https://example.com/path-to-placeholder-image.jpg' }}
          style={{ height: '100%', width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        />
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: 100,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {card.displayName}, {card.age}
          </Text>
          <Text style={{ fontSize: 16, color: 'gray' }}>{card.occupation}</Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#FF5864',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => {
              setSelectedProfile(card);
              setModalVisible(true);
            }}
          >
            <Text style={{ color: 'white' }}>Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 }}>
        <TouchableOpacity onPress={logout}>
          <Image source={{ uri: user.photoURL }} style={{ height: 40, width: 40, borderRadius: 20 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image
            source={{ uri: user.photoURL }} // Use user photoURL
            resizeMode="contain"
            style={{ height: 48, width: 48 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" color="#FF5864" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {noMoreProfiles ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No more profiles left</Text>
          </View>
        ) : (
          <Swiper
            ref={swiperRef}
            cards={profiles}
            renderCard={renderCard}
            onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
            onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
            verticalSwipe={false}
            infinite={false}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingBottom: 20,
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
      >
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeLeft()}
          style={{
            backgroundColor: '#FF5864',
            width: 70,
            height: 70,
            borderRadius: 35,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}
        >
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeRight()}
          style={{
            backgroundColor: '#4CAF50',
            width: 70,
            height: 70,
            borderRadius: 35,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}
        >
          <AntDesign name="hearto" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{selectedProfile?.firstName}Preferences</Text>
            {selectedProfile?.lifestyle.map((item, index) => (
              <View key={index} style={{ marginVertical: 5 }}>
                <Text style={{ fontSize: 16 }}>{item.selectedOption}</Text>
              </View>
            ))}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#FF5864',
                paddingVertical: 10,
                borderRadius: 5,
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Homescreen;
