import React from "react";
import { View, Text, Platform, StyleSheet, Button } from "react-native";

const instructions = Platform.select({
  web: "Your browser will automatically refresh as soon as you save the file.",
});

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to React Native Web universal app!
      </Text>
      <Text style={styles.instructions}>
        This component is shared between web and react environment. To see how
        it works, just edit the HomeScreen.js
      </Text>
      <Text style={styles.instructions}>{instructions}</Text>
      <Button
        title="Go to Baseball Standings!"
        onPress={() => navigation.navigate("BaseballStandings")}
      />
      <Button
        title="Go to Basketball Standings!"
        onPress={() => navigation.navigate("BasketballStandings")}
      />
      <Button
        title="Go to Second!"
        onPress={() => navigation.navigate("Second")}
      />
      <Button
        title="Das Modal"
        onPress={() => navigation.navigate("DasModal")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

export default HomeScreen;
