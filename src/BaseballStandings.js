import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "./components/Row";

import { getBaseballStandingsStateSelectors } from "./store/standings/baseballStandingsReducer";
import {
  scrapeBaseballStandings,
  sortByColumn,
} from "./store/standings/baseballStandingsActions";

import { sortBy } from "./utils/";

class BaseballStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      h2hStandings: {
        sortedColumn: "h2hTrifectaPoints",
        sortedDirection: "highToLow",
      },
      trifectaStandings: {
        sortedColumn: "totalTrifectaPoints",
        sortedDirection: "highToLow",
      },
    };
  }

  componentDidMount() {
    this.props.scrapeBaseballStandings();
  }

  sortByTrifectaPoints = () => {
    const { sortByColumn, trifectaStandings } = this.props;

    const trifectaStandingsSorted = [...trifectaStandings];

    if (this.state.trifectaStandings.sortedDirection === "highToLow") {
      trifectaStandingsSorted.sort((a, b) =>
        a["totalTrifectaPoints"] > b["totalTrifectaPoints"] ? 1 : -1
      );

      this.setState({
        trifectaStandings: {
          sortedColumn: "totalTrifectaPoints",
          sortedDirection: "lowToHigh",
        },
      });
    } else {
      trifectaStandingsSorted.sort((a, b) =>
        a["totalTrifectaPoints"] < b["totalTrifectaPoints"] ? 1 : -1
      );

      this.setState({
        trifectaStandings: {
          sortedColumn: "totalTrifectaPoints",
          sortedDirection: "highToLow",
        },
      });
    }

    sortByColumn(trifectaStandingsSorted);
  };

  sortByRotoTrifectaPoints = () => {
    const { sortByColumn, trifectaStandings } = this.props;

    const trifectaStandingsSorted = [...trifectaStandings];

    if (this.state.trifectaStandings.sortedDirection === "highToLow") {
      trifectaStandingsSorted.sort((a, b) =>
        a["rotoTrifectaPoints"] > b["rotoTrifectaPoints"] ? 1 : -1
      );

      this.setState({
        trifectaStandings: {
          sortedColumn: "rotoTrifectaPoints",
          sortedDirection: "lowToHigh",
        },
      });
    } else {
      trifectaStandingsSorted.sort((a, b) =>
        a["rotoTrifectaPoints"] < b["rotoTrifectaPoints"] ? 1 : -1
      );

      this.setState({
        trifectaStandings: {
          sortedColumn: "rotoTrifectaPoints",
          sortedDirection: "highToLow",
        },
      });
    }

    sortByColumn(trifectaStandingsSorted);
  };

  sortByH2HTrifectaPoints = () => {
    const { sortByColumn, trifectaStandings } = this.props;

    const trifectaStandingsSorted = [...trifectaStandings];

    if (this.state.trifectaStandings.sortedDirection === "highToLow") {
      trifectaStandingsSorted.sort((a, b) =>
        a["h2hTrifectaPoints"] > b["h2hTrifectaPoints"] ? 1 : -1
      );

      this.setState({
        trifectaStandings: {
          sortedColumn: "h2hTrifectaPoints",
          sortedDirection: "lowToHigh",
        },
      });
    } else {
      trifectaStandingsSorted.sort((a, b) =>
        a["h2hTrifectaPoints"] < b["h2hTrifectaPoints"] ? 1 : -1
      );

      this.setState({
        trifectaStandings: {
          sortedColumn: "h2hTrifectaPoints",
          sortedDirection: "highToLow",
        },
      });
    }

    sortByColumn(trifectaStandingsSorted);
  };

  renderHeaderRowColumn = item => {
    return (
      <Button key={item.title} title={item.title} onPress={item.onPress} />
    );
  };

  noop = () => {};

  render() {
    const {
      navigation,
      h2hStandings,
      rotoStandings,
      trifectaStandings,
      lastScraped,
    } = this.props;

    if (!h2hStandings || !rotoStandings || !trifectaStandings) return null;

    const trifectaStandingsHeaderRowMap = [
      { title: "Team Name", onPress: this.noop },
      { title: "H2H Trifecta Points", onPress: this.sortByH2HTrifectaPoints },
      { title: "Roto Trifecta Points", onPress: this.sortByRotoTrifectaPoints },
      { title: "Total Trifecta Points", onPress: this.sortByTrifectaPoints },
    ];

    const trifectaStandingsHeaderRow = trifectaStandingsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={styles.welcome}>Baseball Standings!</Text>
          <Text>{lastScraped}</Text>
        </View>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Row
            data={trifectaStandingsHeaderRow}
            height={50}
            totalWidth={500}
            widthArray={[200, 100, 100, 100]}
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
        </View>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>H2H Standings</Text>
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
        </View>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>Roto Stats</Text>
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
            numberOfLines={2}
          />
        </View>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>Roto Standings</Text>
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
        </View>
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
  sortByColumn,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseballStandings);
