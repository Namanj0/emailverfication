import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomBar from '../components/BottomBar';

const FeaturesScreen = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation(); // Initialize navigation

  const features = [
    { id: '1', name: 'Expense Tracker', icon: 'attach-money', screen: 'ExpenseTrackerScreen' },
    { id: '2', name: 'Uni Chat', icon: 'chat', screen: 'UniScreen' },
    { id: '3', name: 'Apartments/PGs Listing', icon: 'house', screen: 'ListingScreen' },
  ];

  const filteredFeatures = features.filter((feature) =>
    feature.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Features</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search features..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <FlatList
          data={filteredFeatures}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.featureBox}
              onPress={() => navigation.navigate(item.screen)} // Navigate to the respective screen
            >
              <View style={styles.featureContent}>
                <MaterialIcons name={item.icon} size={24} color="white" />
                <Text style={styles.featureText}>{item.name}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
          )}
        />
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoon}>More features coming soon...</Text>
        </View>
      </View>
      <BottomBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    paddingBottom: 80, // Space for bottom bar
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },
  featureBox: {
    flex: 1,
    backgroundColor: '#03A9F4',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',

  },
  icon: {
    marginLeft: 5,
  },
  comingSoonContainer: {
    alignItems: 'center',
    marginTop: 0,
    position: 'absolute',
    top: 400,
    left: 86,
  },
  comingSoon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default FeaturesScreen;
