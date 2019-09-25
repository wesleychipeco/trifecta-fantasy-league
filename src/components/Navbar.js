import React, { PureComponent } from "react";
import { View, Button, StyleSheet } from "react-native";
import { StandingsDropdown } from "./StandingsDropdown";

export class Navbar extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.navbar}>
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
        <StandingsDropdown year="2019" navigation={navigation} />
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
