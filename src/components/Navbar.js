import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { StandingsDropdownPre2019 } from "./StandingsDropdownPre2019";
import { StandingsDropdownPost2019 } from "./StandingsDropdownPost2019";
import { MyButton } from "./MyButton";

export class Navbar extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.navbar}>
        <MyButton
          title="Home"
          onPress={() => navigation.navigate("Home")}
          touchableStyles={{
            borderWidth: 3,
            borderColor: "#000",
            backgroundColor: "#007FFF",
            padding: 5,
          }}
          textStyles={{ color: "#FFFFFF" }}
        />
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
            borderWidth: 3,
            borderColor: "#000",
            backgroundColor: "#007FFF",
            padding: 5,
          }}
          textStyles={{ color: "#FFFFFF" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#cccccc",
    width: "100%",
  },
});
