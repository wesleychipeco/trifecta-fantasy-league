import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { scrapeMatchups } from "../store/matchups/matchupsActions";

class MatchupsScraper extends React.Component {
  async componentDidMount() {
    const { match, scrapeMatchups } = this.props;
    const { year } = match.params;
    scrapeMatchups(year);
  }

  render() {
    const { year } = this.props.match.params;
    return (
      <View style={styles.container}>
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
    backgroundColor: "black",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "white",
  },
});

const mapDispatchToProps = {
  scrapeMatchups,
};

export default connect(null, mapDispatchToProps)(MatchupsScraper);
