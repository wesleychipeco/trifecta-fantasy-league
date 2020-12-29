import React from "react";
import { View, Text } from "react-native";
import { Navbar } from "../components/Navbar";
import { homeScreenStyles as styles } from "../styles/globalStyles";
import { MyButton } from "../components/MyButton";
import { StandingsDropdownPre2019 } from "../components/StandingsDropdownPre2019";
import { StandingsDropdownPost2019 } from "../components/StandingsDropdownPost2019";

const homeText = "All-time Trifecta & Individual Sports Standings";

const HallOfFameTrifecta = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.header}>
        <Text style={styles.welcome}>Trifecta Fantasy League Hall of Fame</Text>
        <Text style={styles.caption}>{homeText}</Text>
      </View>
      {/* <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "90%",
          marginTop: 20,
        }}
      > */}
      <MyButton
        title="Hall of Champions"
        onPress={() => navigation.navigate("HallOfChampions")}
        touchableStyles={styles.buttonTouchable}
        textStyles={styles.buttonText}
      />
      {/* </View> */}
    </View>
  );
};

export default HallOfFameTrifecta;
