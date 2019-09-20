import React, { PureComponent } from "react";
import { View, Button, StyleSheet } from "react-native";

export class Navbar extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.navbar}>
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
        <Button
          title="2019 Trifecta Standings"
          onPress={() =>
            navigation.navigate("TrifectaStandings", { year: "2019" })
          }
        />
        <Button
          title="2019 Basketball Standings"
          onPress={() =>
            navigation.navigate("BasketballStandings", { year: "2019" })
          }
        />
        <Button
          title="2019 Baseball Standings"
          onPress={() =>
            navigation.navigate("BaseballStandings", { year: "2019" })
          }
        />
        <Button
          title="2019 Football Standings"
          onPress={() =>
            navigation.navigate("FootballStandings", { year: "2019" })
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
