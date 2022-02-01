import React from "react";
import { View, Text } from "react-native";
import { Navbar } from "../components/Navbar";
import { homeScreenStyles as styles } from "../styles/globalStyles";
import { MyButton } from "../components/MyButton";
import { StandingsDropdownPre2019 } from "../components/StandingsDropdownPre2019";
import { StandingsDropdownPost2019 } from "../components/StandingsDropdownPost2019";

const homeText = "All-time Trifecta & Individual Sports Standings";

const StandingsHomeScreen = ({ navigation }) => {
  console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.header}>
        <Text style={styles.welcome}>Trifecta Fantasy League Standings</Text>
        <Text style={styles.caption}>{homeText}</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "90%",
          marginTop: 20,
        }}
      >
        <StandingsDropdownPost2019 year="2022" navigation={navigation} />
        <StandingsDropdownPost2019 year="2021" navigation={navigation} />
        <StandingsDropdownPost2019 year="2020" navigation={navigation} />
        <StandingsDropdownPost2019 year="2019" navigation={navigation} />
        <StandingsDropdownPre2019
          year1="2017"
          year2="2018"
          navigation={navigation}
        />
        <StandingsDropdownPre2019
          year1="2016"
          year2="2017"
          navigation={navigation}
        />
        <StandingsDropdownPre2019
          year1="2015"
          year2="2016"
          navigation={navigation}
        />
        <MyButton
          title="2018 Football Standings"
          onPress={() =>
            navigation.navigate("FootballStandings", { year: "2018" })
          }
          touchableStyles={{
            borderWidth: 2,
            borderColor: "#000000",
            backgroundColor: "#007FFF",
            padding: 5,
          }}
          textStyles={{ color: "#FFFFFF" }}
        />
      </View>
    </View>
  );
};

export default StandingsHomeScreen;
