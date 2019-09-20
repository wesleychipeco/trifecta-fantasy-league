import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { Navbar } from "../components/Navbar";
import Iframe from "react-iframe";

const homeText =
  "Version 2.0 will be very different, namely not being based on ESPN website scraping, rather using data APIs. Practically, this means shorter load times and more reliable (hopefully) website performance. It is not known or guaranteed which features will return, continue, or be introduced, though you can see my timeline/plans for it below";

const featureList = [
  "+ Past Trifecta Standings",
  "+ Historical Head to Head Owner Matchups",
  "+ Trade History",
  "+ Owner Trophy Case",
  "+ Add onto/continue some features from v1.0",
  "    - Football coach rankings",
  "    - Recaps of each season per owner",
  "+ Constant visual improvements",
];

const caveatText =
  "Unfortunately, due to new data source, at this moment individual player data will be more difficult (players are identified by an id number rather than name), as of now, roster stats and acquisition value, etc are on hold";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <Image
        style={{ height: 250, width: "100%" }}
        source={require("../resources/images/trifecta_banner.jpg")}
        resizeMode="contain"
      />
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome to the Chips and Markers Trifecta Fantasy League website 2.0!
        </Text>
        <Text style={styles.instructions}>{homeText}</Text>
      </View>
      {/* <Button
        title="Go to Second!"
        onPress={() => navigation.navigate("Second")}
      />
      <Button
        title="Das Modal"
        onPress={() => navigation.navigate("DasModal")}
      /> */}
      <View style={styles.future}>
        <View style={styles.timeline}>
          <Text>Timeline</Text>
          <FlatList
            data={featureList}
            renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
          />
        </View>
        <Text style={styles.item}>{caveatText}</Text>
      </View>
      <Iframe
        url="https://docs.google.com/document/d/e/2PACX-1vSeFK20JkrIc-uYTICX5rE9jywgCZ32LD03k8LbLP5tqagoIS1I4Br1iI3ObKk0Z9vbJ3hltu62F03M/pub?embedded=true"
        width="80%"
        height={750}
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  header: {
    width: "80%",
    marginTop: 20,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
  },
  instructions: {
    textAlign: "center",
    fontSize: 16,
  },
  timeline: {
    alignSelf: "center",
  },
  future: {
    marginVertical: 20,
    width: "80%",
  },
  item: {
    fontSize: 16,
    alignSelf: "flex-start",
    textAlign: "center",
  },
});

export default HomeScreen;
