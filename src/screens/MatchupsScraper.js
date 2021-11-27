import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Navbar } from "../components/Navbar";
import { scrapeMatchups } from "../store/matchups/matchupsActions";

class MatchupsScraper extends React.Component {
  async componentDidMount() {
    const { navigation, scrapeMatchups } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    scrapeMatchups(year);
  }

  render() {
    const { navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");
    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <Text
          style={styles.welcome}
        >{`Name of the matchups scrape: ${year}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});

const mapDispatchToProps = {
  scrapeMatchups,
};

export default connect(null, mapDispatchToProps)(MatchupsScraper);
