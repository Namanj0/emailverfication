import React, { useState } from 'react';
import { View, Image, FlatList, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  { id: '1', src: 'https://wallpapers-clan.com/wp-content/uploads/2022/12/lionel-messi-pfp-2.jpg' },
  { id: '2', src: 'https://i.pinimg.com/736x/df/ba/92/dfba921b3c3fcc7dfdb66274a5c065b5.jpg' },
  { id: '3', src: 'https://i.pinimg.com/564x/db/1a/aa/db1aaa0c53ae8ebb0b229b00d2301448.jpg' },
  // Add more images by replacing the src link
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTap = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={handleTap}>
        <Image source={{ uri: images[currentIndex].src }} style={styles.image} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%", // Make the image square, or adjust as needed
    resizeMode: 'cover',
  },
});

export default ImageCarousel;
