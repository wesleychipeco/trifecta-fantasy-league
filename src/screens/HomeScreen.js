import React from "react";
import { View, Text, Image } from "react-native";
import { MyButton } from "../components/MyButton";
import Iframe from "react-iframe";
import { homeScreenStyles as styles } from "../styles/globalStyles";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.trifectaBanner}
        source={require("../resources/images/trifecta_banner.jpg")}
        resizeMode="contain"
      />
      <MyButton
        touchableStyles={styles.commissionerButton}
        title=""
        onPress={() => navigation.navigate("Commissioner")}
      />
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome to the Chips and Markers Trifecta Fantasy League website 2.0!
        </Text>
        <Text style={styles.caption}>
          See the official Trifecta League Manual below
        </Text>
      </View>
      {/*<<Button
        title="Das Modal"
        onPress={() => navigation.navigate("DasModal")}
      /> */}
      <Iframe
        url="https://docs.google.com/document/d/e/2PACX-1vSeFK20JkrIc-uYTICX5rE9jywgCZ32LD03k8LbLP5tqagoIS1I4Br1iI3ObKk0Z9vbJ3hltu62F03M/pub?embedded=true"
        width={styles.googleDoc.width}
        height={styles.googleDoc.height}
        style={styles.googleDoc.style}
      />
    </View>
  );
};

export default HomeScreen;
