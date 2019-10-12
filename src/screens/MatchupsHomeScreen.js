import React, { PureComponent } from "react";
import { View, Text, Button } from "react-native";
import { Navbar } from "../components/Navbar";
import { homeScreenStyles as styles } from "../styles/globalStyles";

export class MatchupsHomeScreen extends PureComponent {
  renderButton = (ownerName, index) => {
    const { navigation } = this.props;
    const ownerNumber = (index + 1).toString();
    console.log(ownerName);
    return (
      <Button
        title={ownerName + " 2018 Matchups"}
        onPress={() =>
          navigation.navigate("Matchups", {
            year: "2018",
            ownerNumber,
          })
        }
      />
    );
  };

  render() {
    const { navigation } = this.props;
    const ownerNames = [
      "Marcus Lam",
      "Wesley Chipeco",
      "Kevin Okamoto, Joshua Liu",
      "Bryan Kuh",
      "Joshua Apostol",
      "Joshua Aguirre",
      "Tim Fong",
      "Ryan Tomimitsu",
      "Nick Wang",
      "Wayne Fong",
    ];

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.header}>
          <Text style={styles.welcome}>
            Historical Head-to-Head Owner Matchups
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            marginTop: 20,
          }}
        >
          {ownerNames.map(this.renderButton)}
        </View>
      </View>
    );
  }
}

export default MatchupsHomeScreen;
