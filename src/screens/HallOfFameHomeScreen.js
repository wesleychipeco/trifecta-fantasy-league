import React from "react";
import { View, Text, Image } from "react-native";
import { Navbar } from "../components/Navbar";
import { hallOfFameStyles as styles } from "../styles/globalStyles";
import { MyButton } from "../components/MyButton";

const HallOfFameHomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.header}>
        <Text style={styles.welcome}>Trifecta Fantasy League Hall of Fame</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: 275,
          marginTop: 20,
        }}
      >
        <MyButton
          title="Basketball Hall of Fame"
          onPress={() => navigation.navigate("HallOfFameBasketball")}
          touchableStyles={styles.buttonTouchable}
          textStyles={styles.buttonText}
        />
        <MyButton
          title="Baseball Hall of Fame"
          onPress={() => navigation.navigate("HallOfFameBaseball")}
          touchableStyles={styles.buttonTouchable}
          textStyles={styles.buttonText}
        />
        <MyButton
          title="Football Hall of Fame"
          onPress={() => navigation.navigate("HallOfFameFootball")}
          touchableStyles={styles.buttonTouchable}
          textStyles={styles.buttonText}
        />
      </View>
      <View style={styles.championHeader}>
        <Text style={styles.championHeaderText}>Trifecta Champions</Text>
      </View>
      <View style={styles.championsContainer}>
        <Image
          style={styles.trifectaTrophy}
          source={require("../resources/images/TrifectaTrophy.jpg")}
          resizeMode="contain"
        />
        <View style={styles.trifectaChampions}>
          <Text style={styles.championText}>
            Season 1: 2015-2016{"\n"}Joshua Apostol - 27.5 points
          </Text>
          <Text style={styles.championText}>
            Season 2: 2016-2017{"\n"}Ryan Tomimitsu - 32.5 points
          </Text>
          <Text style={styles.championText}>
            Season 3: 2017-2018{"\n"}Marcus Lam - 57 points
          </Text>
          <Text style={styles.championText}>
            Season 4: 2019{"\n"}Joshua Liu - 54 points
          </Text>
          <Text style={styles.championText}>
            Season 5: 2020{"\n"}Wesley Chipeco - 56.5 points
          </Text>
          <Text style={styles.championText}>
            Season 6: 2021{"\n"}Joshua Apostol {"&"} Wesley Chipeco - 51 points
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HallOfFameHomeScreen;
