import React, { PureComponent } from "react";
import { View, Button, StyleSheet } from "react-native";
import { StandingsDropdownPre2019 } from "./StandingsDropdownPre2019";
import { StandingsDropdownPost2019 } from "./StandingsDropdownPost2019";

export class Navbar extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.navbar}>
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
        <StandingsDropdownPost2019 year="2019" navigation={navigation} />
        <StandingsDropdownPre2019
          year1="2017"
          year2="2018"
          navigation={navigation}
        />
        <Button
          title="2018 Football Standings"
          onPress={() =>
            navigation.navigate("FootballStandings", { year: "2018" })
          }
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
