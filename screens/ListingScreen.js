import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import BottomBar from '../components/BottomBar';

const ListingScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
          Coming Soon...
        </Text>
      </View>
      <BottomBar />
    </SafeAreaView>
  );
};

export default ListingScreen;