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

  const renderStandings = (team, index) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          flexDirection: "row",
          alignSelf: "stretch",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Text>{team.teamName}</Text>
        <Text>{team.wins}</Text>
        <Text>{team.losses}</Text>
        <Text>{team.ties}</Text>
        <Text>{team.winPer.toFixed(3)}</Text>
        <Text>{team.h2hTrifectaPoints}</Text>
      </View>
    );
  };

  const { navigation, baseballStandings } = props;

  return (
    <View style={styles.container}>
      <Rows
        data={[["1", "2", "3"], ["A", "Bdggdgdgdd", "C"]]}
        totalHeight={300}
        heightArray={[150, 100]}
        totalWidth={400}
        widthArray={[100, 200, 100]}
        flexArray={[1, 2, 1]}
        cellStyle={{
          backgroundColor: "#008000",
          padding: 2,
          justifyContent: "center",
        }}
      ></Rows>
      <Text style={styles.welcome}>Baseball Standings!</Text>
      <Text>{props.lastScraped}</Text>
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignSelf: "stretch",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text>Team Name</Text>
          <Text>Wins</Text>
          <Text>Losses</Text>
          <Text>Ties</Text>
          <Text>Win %</Text>
          <Text>H2H Trifecta Points</Text>
        </View>
        {baseballStandings.map((team, index) => renderStandings(team, index))}
      </View>
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
