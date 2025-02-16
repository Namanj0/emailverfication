import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, Modal, StyleSheet, FlatList, Dimensions, } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import generateId from '../lib/generateId';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import BottomBar from '../components/BottomBar';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import SinglePageOnboardingScreen from './SinglePageOnboardingScreen'; // Import the Onboarding Screen

const cleanlinessLabels = [
  "Nah... I’m a Mess",  // 1
  "It’s a Disaster Zone", // 2
  "Clean-ish",  // 3
  "I Can’t Find the Floor", // 4
  "Not Bad, Not Great", // 5
  "Kinda Clean, But Not Really", // 6
  "Clean Enough to Post a Pic", // 7
  "Neat Freak Mode Activated", // 8
  "Everything’s Sparkling", // 9
  "OCD Level Clean" // 10
];

const noiseLabels = [
  "Shh... Whispering", // 1
  "Can Hear My Thoughts", // 2
  "I’m More of a Silent Movie", // 3
  "Talking Softly", // 4
  "Normal Talk, Not a Party", // 5
  "Slightly Louder Than I Should Be", // 6
  "Music Is My Mood", // 7
  "Neighbors Are Complaining", // 8
  "I’m Basically a DJ", // 9
  "Speakers Full Blast" // 10
];
// Map slider value to label for Cleanliness and Noise Level
const getCleanlinessLabel = (value) => cleanlinessLabels[value - 1];
const getNoiseLevelLabel = (value) => noiseLabels[value - 1];



const DUMMY_DATA = [
  // Sample data
];

const Homescreen = () => {
  const [hobbiesModalVisible, setHobbiesModalVisible] = useState(false);
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const [extraProfiles, setExtraProfiles] = useState([]);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const swiperRef = useRef();
  const [loading, setLoading] = useState(true); // Add loading state

  const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  };

  function createFeatureVector(user) {
    if (!user) return []; // Return an empty vector if user is undefined

    const genderCategories = ["Male", "Female", "Other"];
    const dietCategories = ["Non-Veg", "Veg"];
    const fitnessCategories = ["None", "Occasional", "Daily"];
    const sleepCategories = ["Early Bird", "Night Owl", "Flexible"];
    const socialCategories = ["Introvert", "Extrovert", "Ambivert"];
    const hobbiesList = ["Gym", "Football", "Traveling", "Video Games", "Finance"];

    const encodeCategorical = (value, categories) => {
      if (value === undefined || value === null) return -1;
      const index = categories.indexOf(value);
      return index !== -1 ? index : categories.length;
    };

    // Assign weights
    const weights = {
      hobbies: 2,      // High weight
      sleep: 3,      // Medium weight
      social: 1      // Low weight
    };

    const hobbiesVector = hobbiesList.map(hobby =>
      user.hobbiesAndInterests && user.hobbiesAndInterests.includes(hobby) ? 1 * weights.hobbies : 0
    );

    const featureVector = [
      encodeCategorical(user.gender, genderCategories),
      ...hobbiesVector,
      encodeCategorical(user.lifestyle?.['Diet Preference'], dietCategories),
      encodeCategorical(user.lifestyle?.['Fitness Habits'], fitnessCategories),
      encodeCategorical(user.lifestyle?.['Sleeping Habits'], sleepCategories) * weights.sleep,
      encodeCategorical(user.lifestyle?.['Social Habit'], socialCategories) * weights.social,
    ];

    return featureVector;
  }

  useLayoutEffect(() => {
    if (!user) return; // Ensure user is defined
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate('OnboardingScreen');
      }
    });
    return unsub;
  }, [navigation, user]);

  useEffect(() => {
    if (!user) return; // Ensure user is defined

    const fetchProfiles = async () => {
      try {
        setLoading(true); // Set loading to true

        // Fetch passes and swipes
        const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then(snapshot =>
          snapshot.docs.map(doc => doc.id)
        );
        const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes')).then(snapshot =>
          snapshot.docs.map(doc => doc.id)
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
          snapshot.docs.forEach(doc => {
            if (doc.id !== user.uid) {
              profilesFromDB.push({
                id: doc.id,
                ...doc.data(),
              });
            }
          });
        }

        const loggedInUser = await getDoc(doc(db, 'users', user.uid)).then(doc => doc.data());
        const loggedInUserVector = createFeatureVector(loggedInUser);

        const matchedProfiles = [];
        const otherProfiles = [];

        profilesFromDB.forEach(profile => {
          if (profile.gender !== loggedInUser.gender ||
            profile.lifestyle?.['Diet Preference'] !== loggedInUser.lifestyle?.['Diet Preference'] ||
            profile.university !== loggedInUser.university) {
            return; // Skip profiles that do not match fixed criteria
          }

          const profileVector = createFeatureVector(profile);
          const similarityScore = cosineSimilarity(loggedInUserVector, profileVector);
          console.log('similarity score is:', similarityScore);
          if (similarityScore >= 0.2) {
            matchedProfiles.push({ ...profile, similarityScore });
          } else {
            otherProfiles.push(profile);
          }
        });

        if (matchedProfiles.length === 0 && otherProfiles.length === 0) {
          setNoMoreProfiles(true);
        } else {
          setProfiles(matchedProfiles);
          setExtraProfiles(otherProfiles);
          setNoMoreProfiles(matchedProfiles.length === 0);
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchProfiles();

    // Set up real-time listener for profile updates
    const unsub = onSnapshot(collection(db, 'users'), snapshot => {
      fetchProfiles();
    });

    return () => unsub(); // Clean up listener on component unmount
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

    const docSnapshot = await getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid));
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
  };


  const renderCard = (card) => {
    if (!card) {
      return (
        <View style={{ backgroundColor: 'white', height: '75%', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No Profiles Available</Text>
        </View>
      );
    }

    const { images = [], lifestyle = {}, hobbiesAndInterests = [], similarityScore = [] } = card;
    const validImages = images.filter((image) => typeof image === 'string' && image.trim() !== '');
    const imagesToDisplay = validImages.length >= 3 ? validImages.slice(0, 3) : validImages;

    return (
      <View style={{ backgroundColor: 'white', height: '75%', borderRadius: 16 }}>
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
            {/* Optionally add a placeholder or other content here */}
          </View>
        )}
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: 190,
            flexDirection: 'column',
            justifyContent: 'left',
            alignItems: 'left',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.6,
            shadowRadius: 1.41,
            elevation: 2,
          }}
        >
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5, }}>
              {card.displayName || 'Unknown'}, {card.age || '?'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text style={{ fontSize: 16, color: 'gray', marginRight: 5 }}>{card.occupation || 'Unknown'}</Text>
            <Text style={{ fontSize: 16, color: 'gray', marginRight: 5 }}>{card.university || 'Unknown'}</Text>
            <Text style={{ fontSize: 16, color: 'gray', marginRight: 5 }}>{card.gender || 'Unknown'}</Text>
            <Text style={{ fontSize: 16, color: 'gray' }}>Similarity Score: {similarityScore.toFixed(2)}</Text>
          </View>
          {lifestyle && Object.keys(lifestyle).length > 0 && (
            <View style={{ marginTop: 6, flexDirection: 'row' }}>
              {Object.entries(lifestyle)
                .filter(([key]) => key !== 'Cleanliness' && key !== 'Noise Level') // Exclude specific keys
                .map(([key, value], index) => (
                  <Text key={index} style={{ fontSize: 16, color: 'gray', marginRight: 5 }}>
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </Text>
                ))}
            </View>
          )}
          {/* Display Hobbies and Interests including custom hobbies */}
          <TouchableOpacity onPress={() => {
            setSelectedProfile(card);
            setHobbiesModalVisible(true); // Show hobbies modal
          }}>
            <Text style={{ color: 'white', padding: 7, backgroundColor: 'black', marginTop: 10, width: 100, textAlign: 'center' }}>
              View More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
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
            stackSize={50} // Limit the number of cards stacked
            verticalSwipe={false}
            infinite={false}
            showSecondCard={true}
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
      <View style={styles.bottomBarContainer}>
        <BottomBar />
      </View>

      {/* Hobbies Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={hobbiesModalVisible}
        onRequestClose={() => setHobbiesModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Hobbies & Interests</Text>
          {selectedProfile && (
            <View style={styles.hobbiesContainer}>
              {selectedProfile.hobbiesAndInterests.map((hobby, index) => (
                <View key={index} style={styles.hobbyItem}>
                  <Text style={styles.hobbyText}>{hobby}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Cleanliness and Noise Level sliders in modal */}
          {selectedProfile?.lifestyle && (
            <>
              {selectedProfile.lifestyle.Cleanliness !== undefined && (
                <>
                  <Text style={styles.sliderLabel}>Cleanliness</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={selectedProfile.lifestyle.Cleanliness}
                    disabled={true}
                    minimumTrackTintColor="white"
                    maximumTrackTintColor="lightgray"
                    thumbTintColor="black"
                  />
                  <Text style={styles.sliderValue}>Selected: {getCleanlinessLabel(selectedProfile.lifestyle.Cleanliness)}</Text>
                </>
              )}
              {selectedProfile.lifestyle['Noise Level'] !== undefined && (
                <>
                  <Text style={styles.sliderLabel}>Noise Level</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={selectedProfile.lifestyle['Noise Level']}
                    disabled={true}
                    minimumTrackTintColor="white"
                    maximumTrackTintColor="lightgray"
                    thumbTintColor="black"
                  />
                  <Text style={styles.sliderValue}>Selected: {getNoiseLevelLabel(selectedProfile.lifestyle['Noise Level'])}</Text>
                </>
              )}
            </>
          )}


          {/* Close Button */}
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => setHobbiesModalVisible(false)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>


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
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 200,
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
    zIndex: 10,
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
    zIndex: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Make sure the background color is solid
  },
  image: {
    width: 375, // Adjust width as needed
    height: 400, // Adjust height as needed
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  noImages: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',

  },
  sliderLabel: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 50,
    color: 'white',
    fontWeight: 'bold',
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
  slider: {
    width: '90%',
    height: 40,

  },

  hobbiesContainer: {
    flex: 0.6,
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows hobbies to wrap to the next line if they overflow
    justifyContent: 'center',


  },
  modalText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  hobbyItem: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 5,
    width: '40%',
    alignItems: 'center',

  },
  buttonClose: {
    marginBottom: -30,
    backgroundColor: '#FF5864',
    borderRadius: '20%',
    padding: 15,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  textStyle: {
    color: 'white',
    fontSize: '16'
  },
});

export default Homescreen;
//perfect..............