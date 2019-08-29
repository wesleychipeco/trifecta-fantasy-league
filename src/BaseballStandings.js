import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "./components/Row";

import { getBaseballStandingsStateSelectors } from "./store/standings/baseballStandingsReducer";
import { scrapeBaseballStandings } from "./store/standings/baseballStandingsActions";

const BaseballStandings = props => {
  const handleScrapeRequest = () => {
    props.scrapeBaseballStandings();
  };

  const { navigation, baseballStandings } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Baseball Standings!</Text>
      <Text>{props.lastScraped}</Text>
      <Row
        data={[
          "Team Name",
          "Wins",
          "Losses",
          "Ties",
          "Win %",
          "H2H Trifecta Points",
        ]}
        height={50}
        totalwidth={700}
        widthArray={[200, 100, 100, 100, 100, 100]}
        // flexArray={[2, 1, 1, 1, 1, 1]}
        rowStyle={{ backgroundColor: "#BEBEBE" }}
        numberOfLines={2}
      />
      <Rows
        data={baseballStandings}
        totalheight={500}
        totalwidth={700}
        widthArray={[200, 100, 100, 100, 100, 100]}
        // flexArray={[2, 1, 1, 1, 1, 1]}
        objectKeys={[
          "teamName",
          "wins",
          "losses",
          "ties",
          "winPer",
          "h2hTrifectaPoints",
        ]}
      />
      <Button title="Scrape!" onPress={handleScrapeRequest} />
      <Button
        title="User #1"
        onPress={() => navigation.navigate("User", { name: "Snufolafakus" })}
      />
      <Button
        title="User #2"
        onPress={() =>
          navigation.navigate("User", { name: "Simsalabimbambasaladusaladim" })
        }
      />
      <Button
        title="Das Modal"
        onPress={() => navigation.navigate("DasModal")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

const mapStateToProps = state => {
  const {
    getBaseballStandings,
    getLastScraped,
  } = getBaseballStandingsStateSelectors(state);

  return {
    baseballStandings: getBaseballStandings(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  scrapeBaseballStandings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseballStandings);
