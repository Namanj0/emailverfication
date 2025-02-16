import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const CardScreen = () => {
  const [profiles, setProfiles] = useState([
    {
      id: '1',
      displayName: 'John Doe',
      age: 25,
      sex: 'Male',
      images: ['https://placekitten.com/200/300', 'https://placekitten.com/201/301'],
    },
    {
      id: '2',
      displayName: 'Jane Smith',
      age: 22,
      sex: 'Female',
      images: ['https://placekitten.com/202/302', 'https://placekitten.com/203/303'],
    },
    {
      id: '3',
      displayName: 'Alice Brown',
      age: 23,
      sex: 'Female',
      images: ['https://placekitten.com/204/304', 'https://placekitten.com/205/305'],
    },
  ]);

  const renderCard = (card) => {
    if (!card) {
      return (
        <View style={styles.card}>
          <Text>No Profiles Available</Text>
        </View>
      );
    }

    const { images = [] } = card;
    const validImages = images.filter((image) => typeof image === 'string' && image.trim() !== '');
    const imagesToDisplay = validImages.length >= 3 ? validImages.slice(0, 3) : validImages;

    return (
      <View style={styles.card}>
        {imagesToDisplay.length > 0 ? (
          imagesToDisplay.map((item, index) => (
            <Image key={index} source={{ uri: item }} style={styles.image} resizeMode="cover" />
          ))
        ) : (
          <View style={styles.imageFallback} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.displayName}>
            {card.displayName || 'Unknown'}, {card.age || '?'}
          </Text>
          <Text style={styles.sex}>{card.sex || 'N/A'}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        cards={profiles}
        renderCard={renderCard}
        onSwipedLeft={(cardIndex) => console.log(`Nope: ${profiles[cardIndex].displayName}`)}
        onSwipedRight={(cardIndex) => console.log(`Like: ${profiles[cardIndex].displayName}`)}
        verticalSwipe={false}
        infinite={true}
        cardIndex={0} // Start from the first card
        backgroundColor="white"
        stackSize={3} // Limit the number of cards stacked
        showSecondCard={true}
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: {
              label: {
                textAlign: 'right',
                color: '#EC4D25',
                fontWeight: 'bold',
                fontSize: 18,
              },
            },
          },
          right: {
            title: 'LIKE',
            style: {
              label: {
                color: '#11B356',
                fontWeight: 'bold',
                fontSize: 18,
              },
            },
          },
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    height: 400,
    width: 300,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    padding: 10,
    elevation: 5, // Add shadow for better visibility
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 10,
  },
  imageFallback: {
    width: '100%',
    height: 250,
    backgroundColor: 'gray',
    borderRadius: 16,
  },
  textContainer: {
    alignItems: 'center',
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sex: {
    fontSize: 16,
  },
});

export default CardScreen;
