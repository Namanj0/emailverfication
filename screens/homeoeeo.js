import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, Modal, StyleSheet, FlatList } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import generateId from '../lib/generateId';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import BottomBar from '../components/BottomBar';
import { StatusBar } from 'expo-status-bar';

import SinglePageOnboardingScreen from './SinglePageOnboardingScreen'; // Import the Onboarding Screen

const DUMMY_DATA = [
  {
    id: '1',
    displayName: 'Messi',
    photoURL: 'https://digitalhub.fifa.com/transform/057b508f-a50b-4a14-91e9-fc1bf5f443b5/Argentina-v-France-Final-FIFA-World-Cup-Qatar-2022',
    age: 24,
    occupation: 'GOAT',
    university: 'Football',
    gender: 'Male',
    lifestyle: {
      "Diet Preference": "Veg",
      "Sleeping Habits": "Early Bird",
      "Fitness Habits": "Daily",
      "Social Habit": "Introvert",
    },
    hobbiesAndInterests: [
      "Gym",
      "Football",
      "Traveling",
      "Parties & Social Gatherings",
      "Video Games"
    ],
  },
  {
    id: '2',
    displayName: 'Barca',
    photoURL: 'https://st2.depositphotos.com/2124563/9993/i/450/depositphotos_99936014-stock-illustration-flag-football-club-barcelona-spain.jpg',
    age: 29,
    occupation: 'Club',
    university: 'Football',
    gender: 'Male',
    lifestyle: {
      "Diet Preference": "Non-Veg",
      "Sleeping Habits": "Night Owl",
      "Fitness Habits": "Often",
      "Social Habit": "Ambivert",
    },
    hobbiesAndInterests: [
      "Reading",
      "Traveling",
      "Parties & Social Gatherings",
      "VR (Virtual Reality)",
      "Investments"
    ],
  },
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
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate('OnboardingScreen');
        }
        return unsub;
      });
      return () => unsub();
    }
  }, [navigation, user]);

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

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
        <View style={styles.cardContainer}>
          <Text>No Profiles Available</Text>
        </View>
      );
    }

    const { images = [], lifestyle = {}, hobbiesAndInterests = [] } = card;

    // Filter out invalid image URLs
    const validImages = images.filter((image) => typeof image === 'string' && image.trim() !== '');

    // Ensure there are at least two images to display
    const imagesToDisplay = validImages.length >= 4 ? validImages.slice(0, 4) : validImages;

    return (
      <View style={styles.cardContainer}>
        {/* Display a horizontal list of images */}
        {imagesToDisplay.length > 0 ? (
          <FlatList
            data={imagesToDisplay}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
          />
        ) : (
          <View style={styles.noImages}>
            <Text>No images available</Text>
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.displayName}>
            {card.displayName || 'Unknown'}, {card.age || '?'}
          </Text>
          <Text style={styles.occupation}>{card.occupation || 'Unknown'}</Text>
          <Text style={styles.university}>{card.university || 'Unknown'}</Text>
          <Text style={styles.gender}>{card.gender || 'Unknown'}</Text>

          {/* Lifestyle Section */}
          {lifestyle && Object.keys(lifestyle).length > 0 && (
            <View style={styles.lifestyleContainer}>
              <Text style={styles.sectionTitle}>Lifestyle:</Text>
              {Object.entries(lifestyle).map(([key, value], index) => (
                <Text key={index} style={styles.lifestyleItem}>
                  • {key}: {value}
                </Text>
              ))}
            </View>
          )}

          {/* Hobbies and Interests Section */}
          {hobbiesAndInterests.length > 0 && (
            <View style={styles.hobbiesContainer}>
              <Text style={styles.sectionTitle}>Hobbies & Interests:</Text>
              {hobbiesAndInterests.map((hobby, index) => (
                <Text key={index} style={styles.hobbyItem}>
                  • {hobby}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };






  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Logout')}>
          <Image
            source={{ uri: user?.photoURL || 'https://i.pinimg.com/564x/f0/c7/c7/f0c7c729f1a989450f9ebd92023e48f8.jpg' }}
            resizeMode="contain"
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <TouchableOpacity>
            <Text style={styles.logo}>LOGO</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.helpButton}>
            <Ionicons name="help-circle-outline" color="#FF5864" size={33} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="notifications-outline" color="#FF5864" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.swiperContainer}>
        {noMoreProfiles ? (
          <View style={styles.noProfiles}>
            <Text>No Profiles Available</Text>
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
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    textAlign: 'right',
                    color: '#EC4D25',
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    color: '#11B356',
                  },
                },
              },
            }}
          />
        )}
      </View>
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeLeft()}
          style={styles.leftButton}
        >
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeRight()}
          style={styles.rightButton}
        >
          <AntDesign name="hearto" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <BottomBar />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <SinglePageOnboardingScreen onClose={() => setModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileImage: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    marginRight: 5,
  },
  swiperContainer: {
    flex: 1,
  },
  noProfiles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 65,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 55,
    width: '100%',
  },
  leftButton: {
    backgroundColor: '#FF5864',
    width: 65,
    height: 65,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  rightButton: {
    backgroundColor: '#4CAF50',
    width: 65,
    height: 65,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Make sure the background color is solid
  },
  cardContainer: {
    backgroundColor: 'white',
    height: '65%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: 125, // Adjust width as needed
    height: 300, // Adjust height as needed
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  noImages: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: 100,
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'left',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  occupation: {
    fontSize: 16,
    color: 'gray',
  },
  university: {
    fontSize: 16,
    color: 'gray',
  },
  gender: {
    fontSize: 16,
    color: 'gray',
  },
  lifestyleContainer: {
    marginTop: 10,
  },
  lifestyleItem: {
    fontSize: 16,
    color: 'gray',
  },
  hobbiesContainer: {
    marginTop: 10,
  },
  hobbyItem: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Homescreen;
//this
//without similarity //two images