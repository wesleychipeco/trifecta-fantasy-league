import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "./components/Row";

import { getBaseballStandingsStateSelectors } from "./store/standings/baseballStandingsReducer";
import {
  scrapeBaseballStandings,
  scrapeH2HBaseballStandings,
  scrapeRotoBaseballStandings,
  calculateTrifectaBaseballStandings,
} from "./store/standings/baseballStandingsActions";

class BaseballStandings extends PureComponent {
  componentDidMount() {
    // this.props.scrapeH2HBaseballStandings();
    // this.props.scrapeRotoBaseballStandings();
    this.props.scrapeBaseballStandings();
  }

  render() {
    const {
      navigation,
      h2hStandings,
      rotoStandings,
      trifectaStandings,
      lastScraped,
    } = this.props;

    if (!h2hStandings || !rotoStandings) return null;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Baseball Standings!</Text>
        <Text>{lastScraped}</Text>
        <Row
          data={[
            "Team Name",
            "H2H Trifecta Points",
            "Roto Trifecta Points",
            "Total Trifecta Points",
          ]}
          height={50}
          totalwidth={500}
          widthArray={[200, 100, 100, 100]}
          // flexArray={[2, 1, 1, 1, 1, 1]}
          rowStyle={{ backgroundColor: "#BEBEBE" }}
          numberOfLines={2}
        />
        <Rows
          data={trifectaStandings}
          totalheight={250}
          totalwidth={500}
          widthArray={[200, 100, 100, 100]}
          // flexArray={[2, 1, 1, 1, 1, 1]}
          objectKeys={[
            "teamName",
            "h2hTrifectaPoints",
            "rotoTrifectaPoints",
            "totalTrifectaPoints",
          ]}
        />
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
          data={h2hStandings}
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
        <Row
          data={[
            "Team Name",
            "R",
            "HR",
            "RBI",
            "K",
            "SB",
            "OBP",
            "SO",
            "QS",
            "W",
            "SV",
            "ERA",
            "WHIP",
          ]}
          height={50}
          totalwidth={700}
          widthArray={[100, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]}
          // flexArray={[2, 1, 1, 1, 1, 1]}
          rowStyle={{ backgroundColor: "#BEBEBE" }}
          numberOfLines={2}
        />
        <Rows
          data={rotoStandings}
          totalheight={500}
          totalwidth={700}
          widthArray={[100, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]}
          // flexArray={[2, 1, 1, 1, 1, 1]}
          objectKeys={[
            "teamName",
            "R",
            "HR",
            "RBI",
            "K",
            "SB",
            "OBP",
            "SO",
            "QS",
            "W",
            "SV",
            "ERA",
            "WHIP",
          ]}
        />
        <Row
          data={[
            "Team Name",
            "R",
            "HR",
            "RBI",
            "K",
            "SB",
            "OBP",
            "SO",
            "QS",
            "W",
            "SV",
            "ERA",
            "WHIP",
            "Total",
            "Roto Trifecta Points",
          ]}
          height={50}
          totalwidth={800}
          widthArray={[
            100,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
          ]}
          // flexArray={[2, 1, 1, 1, 1, 1]}
          rowStyle={{ backgroundColor: "#BEBEBE" }}
          numberOfLines={2}
        />
        <Rows
          data={rotoStandings}
          totalheight={500}
          totalwidth={800}
          widthArray={[
            100,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
          ]}
          // flexArray={[2, 1, 1, 1, 1, 1]}
          objectKeys={[
            "teamName",
            "RPoints",
            "HRPoints",
            "RBIPoints",
            "KPoints",
            "SBPoints",
            "OBPPoints",
            "SOPoints",
            "QSPoints",
            "WPoints",
            "SVPoints",
            "ERAPoints",
            "WHIPPoints",
            "totalPoints",
            "rotoTrifectaPoints",
          ]}
          numberOfLines={2}
        />
        <Button
          title="User #1"
          onPress={() => navigation.navigate("User", { name: "Snufolafakus" })}
        />
        <Button
          title="User #2"
          onPress={() =>
            navigation.navigate("User", {
              name: "Simsalabimbambasaladusaladim",
            })
          }
        />
        <Button
          title="Das Modal"
          onPress={() => navigation.navigate("DasModal")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    getH2HStandings,
    getRotoStandings,
    getTrifectaStandings,
    getLastScraped,
  } = getBaseballStandingsStateSelectors(state);

  return {
    h2hStandings: getH2HStandings(),
    rotoStandings: getRotoStandings(),
    trifectaStandings: getTrifectaStandings(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  scrapeBaseballStandings,
  scrapeH2HBaseballStandings,
  scrapeRotoBaseballStandings,
  calculateTrifectaBaseballStandings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseballStandings);
