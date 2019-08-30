import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "./components/Row";

import { getBaseballStandingsStateSelectors } from "./store/standings/baseballStandingsReducer";
import {
  scrapeH2HBaseballStandings,
  scrapeRotoBaseballStandings,
} from "./store/standings/baseballStandingsActions";

class BaseballStandings extends PureComponent {
  componentDidMount() {
    this.props.scrapeH2HBaseballStandings();
    this.props.scrapeRotoBaseballStandings();
  }

  render() {
    const { navigation, h2hStandings, rotoStandings, lastScraped } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Baseball Standings!</Text>
        <Text>{lastScraped}</Text>
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
        {/* <Button title="Scrape!" onPress={handleScrapeRequest} /> */}
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
    getH2HStandings,
    getRotoStandings,
    getLastScraped,
  } = getBaseballStandingsStateSelectors(state);

  return {
    h2hStandings: getH2HStandings(),
    rotoStandings: getRotoStandings(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  scrapeH2HBaseballStandings,
  scrapeRotoBaseballStandings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseballStandings);
