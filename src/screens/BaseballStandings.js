import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { LinkText } from "../components/LinkText";

import { getBaseballStandingsStateSelectors } from "../store/baseballStandings/baseballStandingsReducer";
import {
  scrapeBaseballStandings,
  displayBaseballStandings,
  sortTable,
} from "../store/baseballStandings/baseballStandingsActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/baseballStandings";
import { sortArrayBy } from "../utils/";
import { returnMongoCollection } from "../databaseManagement";

class BaseballStandings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      seasonStarted: null,
      inSeason: null,
      trifectaStandings: {
        sortedColumn: null,
        highToLow: null,
      },
      h2hStandings: {
        sortedColumn: "h2hTrifectaPoints",
        highToLow: true,
      },
      rotoStandings: {
        sortedColumn: "rotoTrifectaPoints",
        highToLow: true,
      },
      rotoStats: {
        sortedColumn: "teamName",
        highToLow: true,
      },
    };
  }

  componentDidMount() {
    const { lastScraped, navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    const seasonVariablesCollection = returnMongoCollection("seasonVariables");
    seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then(seasonVariables => {
        const { seasonStarted, inSeason } = seasonVariables[0].baseball;

        const defaultSortColumn = inSeason
          ? "trifectaPoints"
          : "totalTrifectaPoints";

        this.setState({
          seasonStarted,
          inSeason,
          trifectaStandings: {
            sortedColumn: defaultSortColumn,
            highToLow: true,
          },
        });

        if (seasonStarted) {
          if (inSeason && !lastScraped) {
            this.props.scrapeBaseballStandings(year);
          } else {
            this.props.displayBaseballStandings(year);
          }
        }
      });
  }

  sortTableByColumn = (tableArray, columnKey, tableType) => {
    const { sortTable } = this.props;
    const { sortedColumn, highToLow } = this.state[tableType];

    const tableArraySorted = [...tableArray];

    if (sortedColumn === columnKey) {
      this.setState({
        [tableType]: {
          sortedColumn: columnKey,
          highToLow: !highToLow,
        },
      });
      sortTable([
        sortArrayBy(tableArraySorted, columnKey, !highToLow),
        tableType,
      ]);
    } else {
      const columnDefaultSortDirection =
        tableDefaultSortDirections[tableType][columnKey];
      this.setState({
        [tableType]: {
          sortedColumn: columnKey,
          highToLow: columnDefaultSortDirection,
        },
      });
      sortTable([
        sortArrayBy(tableArraySorted, columnKey, columnDefaultSortDirection),
        tableType,
      ]);
    }
  };

  noop = () => {};

  // Trifecta Standings Table sort methods
  sortTrifectaStandingsbyH2HPoints = () => {
    const { trifectaStandings } = this.props;
    this.sortTableByColumn(
      trifectaStandings,
      "h2hTrifectaPoints",
      "trifectaStandings"
    );
  };

  sortTrifectaStandingsByRotoPoints = () => {
    const { trifectaStandings } = this.props;
    this.sortTableByColumn(
      trifectaStandings,
      "rotoTrifectaPoints",
      "trifectaStandings"
    );
  };

  sortTrifectaStandingsByTrifectaPoints = () => {
    const { trifectaStandings } = this.props;
    this.sortTableByColumn(
      trifectaStandings,
      "trifectaPoints",
      "trifectaStandings"
    );
  };

  sortTrifectaStandingsByPlayoffPoints = () => {
    const { trifectaStandings } = this.props;
    this.sortTableByColumn(
      trifectaStandings,
      "playoffPoints",
      "trifectaStandings"
    );
  };

  sortTrifectaStandingsByTotalTrifectaPoints = () => {
    const { trifectaStandings } = this.props;
    this.sortTableByColumn(
      trifectaStandings,
      "totalTrifectaPoints",
      "trifectaStandings"
    );
  };

  // H2H Standings Table sort methods
  sortH2HStandingsByWins = () => {
    const { h2hStandings } = this.props;
    this.sortTableByColumn(h2hStandings, "wins", "h2hStandings");
  };

  sortH2HStandingsByLosses = () => {
    const { h2hStandings } = this.props;
    this.sortTableByColumn(h2hStandings, "losses", "h2hStandings");
  };

  sortH2HStandingsByTies = () => {
    const { h2hStandings } = this.props;
    this.sortTableByColumn(h2hStandings, "ties", "h2hStandings");
  };

  sortH2HStandingsByWinPer = () => {
    const { h2hStandings } = this.props;
    this.sortTableByColumn(h2hStandings, "winPer", "h2hStandings");
  };

  sortH2HStandingsByTrifectaPoints = () => {
    const { h2hStandings } = this.props;
    this.sortTableByColumn(h2hStandings, "h2hTrifectaPoints", "h2hStandings");
  };

  // Roto Standings Table sort methods
  sortRotoStandingsByRPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "RPoints", "rotoStandings");
  };

  sortRotoStandingsByHRPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "HRPoints", "rotoStandings");
  };

  sortRotoStandingsByRBIPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "RBIPoints", "rotoStandings");
  };

  sortRotoStandingsByKPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "KPoints", "rotoStandings");
  };

  sortRotoStandingsBySBPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "SBPoints", "rotoStandings");
  };

  sortRotoStandingsByOBPPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "OBPPoints", "rotoStandings");
  };

  sortRotoStandingsBySOPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "SOPoints", "rotoStandings");
  };

  sortRotoStandingsByQSPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "QSPoints", "rotoStandings");
  };

  sortRotoStandingsByWPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "WPoints", "rotoStandings");
  };

  sortRotoStandingsBySVPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "SVPoints", "rotoStandings");
  };

  sortRotoStandingsByERAPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "ERAPoints", "rotoStandings");
  };

  sortRotoStandingsByWHIPPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "WHIPPoints", "rotoStandings");
  };

  sortRotoStandingsByRotoPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "totalPoints", "rotoStandings");
  };

  sortRotoStandingsByTrifectaPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(
      rotoStandings,
      "rotoTrifectaPoints",
      "rotoStandings"
    );
  };

  // Roto Stats Table sort methods
  sortRotoStandingsByR = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "R", "rotoStats");
  };

  sortRotoStandingsByHR = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "HR", "rotoStats");
  };

  sortRotoStandingsByRBI = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "RBI", "rotoStats");
  };

  sortRotoStandingsByK = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "K", "rotoStats");
  };

  sortRotoStandingsBySB = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "SB", "rotoStats");
  };

  sortRotoStandingsByOBP = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "OBP", "rotoStats");
  };

  sortRotoStandingsBySO = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "SO", "rotoStats");
  };

  sortRotoStandingsByQS = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "QS", "rotoStats");
  };

  sortRotoStandingsByW = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "W", "rotoStats");
  };

  sortRotoStandingsBySV = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "SV", "rotoStats");
  };

  sortRotoStandingsByERA = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "ERA", "rotoStats");
  };

  sortRotoStandingsByWHIP = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "WHIP", "rotoStats");
  };

  renderHeaderRowColumn = ({ title, onPress }) => {
    return (
      <LinkText
        key={title}
        title={title}
        onPress={onPress}
        textStyles={{ color: "#0041C2" }}
      />
    );
  };

  render() {
    const {
      navigation,
      trifectaStandings,
      h2hStandings,
      rotoStandings,
      rotoStats,
      lastScraped,
    } = this.props;
    const { seasonStarted, inSeason } = this.state;

    if (seasonStarted === false) {
      return (
        <View>
          <Text>Not in season yet!</Text>
        </View>
      );
    }

    if (!h2hStandings || !rotoStandings || !rotoStats || !trifectaStandings)
      return null;

    ///// Trifecta Standings /////
    const trifectaStandingsHeaderRowHeight = 75;
    const trifectaStandingsTotalHeight = 250;
    const trifectaStandingsTotalWidth = inSeason ? 500 : 700;
    const trifectaStandingsWidthArray = [200, 100, 100, 100];
    const trifectaStandingsObjectKeys = [
      "teamName",
      "h2hTrifectaPoints",
      "rotoTrifectaPoints",
      "trifectaPoints",
    ];

    // Create header row for Trifecta Standings Table
    const trifectaStandingsHeaderRowMap = [
      { title: "Team Name", onPress: this.noop },
      {
        title: "H2H Trifecta Points",
        onPress: this.sortTrifectaStandingsbyH2HPoints,
      },
      {
        title: "Roto Trifecta Points",
        onPress: this.sortTrifectaStandingsByRotoPoints,
      },
      {
        title: "Regular Season Trifecta Points",
        onPress: this.sortTrifectaStandingsByTrifectaPoints,
      },
    ];

    if (!inSeason) {
      trifectaStandingsWidthArray.push(100, 100);
      trifectaStandingsObjectKeys.push("playoffPoints", "totalTrifectaPoints");
      trifectaStandingsHeaderRowMap.push(
        {
          title: "Playoff Points",
          onPress: this.sortTrifectaStandingsByPlayoffPoints,
        },
        {
          title: "Total Trifecta Points",
          onPress: this.sortTrifectaStandingsByTotalTrifectaPoints,
        }
      );
    }

    const trifectaStandingsHeaderRow = trifectaStandingsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    ///// H2H Standings /////
    const h2hStandingsHeaderRowHeight = 75;
    const h2hStandingsTotalHeight = 500;
    const h2hStandingsTotalWidth = 700;
    const h2hStandingsWidthArray = [200, 100, 100, 100, 100, 100];
    const h2hStandingsObjectKeys = [
      "teamName",
      "wins",
      "losses",
      "ties",
      "winPer",
      "h2hTrifectaPoints",
    ];
    // Create header row for H2H Standings Table
    const h2hStandingsHeaderRowMap = [
      { title: "Team Name", onPress: this.noop },
      { title: "Wins", onPress: this.sortH2HStandingsByWins },
      { title: "Losses", onPress: this.sortH2HStandingsByLosses },
      { title: "Ties", onPress: this.sortH2HStandingsByTies },
      { title: "Win %", onPress: this.sortH2HStandingsByWinPer },
      {
        title: "H2H Trifecta Points",
        onPress: this.sortH2HStandingsByTrifectaPoints,
      },
    ];
    const h2hStandingsHeaderRow = h2hStandingsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    ///// ROTO STANDINGS /////
    const rotoStandingsHeaderRowHeight = 75;
    const rotoStandingsTotalHeight = 500;
    const rotoStandingsTotalWidth = 1250;
    const rotoStandingsWidthArray = [
      200,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
    ];
    const rotoStandingsObjectKeys = [
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
    ];
    // Create header row for Roto Standings Table
    const rotoStandingsHeaderRowMap = [
      { title: "Team Name", onPress: this.noop },
      { title: "R", onPress: this.sortRotoStandingsByRPoints },
      { title: "HR", onPress: this.sortRotoStandingsByHRPoints },
      { title: "RBI", onPress: this.sortRotoStandingsByRBIPoints },
      { title: "K", onPress: this.sortRotoStandingsByKPoints },
      { title: "SB", onPress: this.sortRotoStandingsBySBPoints },
      { title: "OBP", onPress: this.sortRotoStandingsByOBPPoints },
      { title: "SO", onPress: this.sortRotoStandingsBySOPoints },
      { title: "QS", onPress: this.sortRotoStandingsByQSPoints },
      { title: "W", onPress: this.sortRotoStandingsByWPoints },
      { title: "SV", onPress: this.sortRotoStandingsBySVPoints },
      { title: "ERA", onPress: this.sortRotoStandingsByERAPoints },
      { title: "WHIP", onPress: this.sortRotoStandingsByWHIPPoints },
      { title: "Roto Points", onPress: this.sortRotoStandingsByRotoPoints },
      {
        title: "Roto Trifecta Points",
        onPress: this.sortRotoStandingsByTrifectaPoints,
      },
    ];
    const rotoStandingsHeaderRow = rotoStandingsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    ///// ROTO STATS /////
    const rotoStatsHeaderRowHeight = 75;
    const rotoStatsTotalHeight = 500;
    const rotoStatsTotalWidth = 1100;
    const rotoStatsWidthArray = [
      200,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
      75,
    ];
    const rotoStatsObjectKeys = [
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
    ];
    const rotoStatsHeaderRowMap = [
      { title: "Team Name", onPress: this.noop },
      { title: "R", onPress: this.sortRotoStandingsByR },
      { title: "HR", onPress: this.sortRotoStandingsByHR },
      { title: "RBI", onPress: this.sortRotoStandingsByRBI },
      { title: "K", onPress: this.sortRotoStandingsByK },
      { title: "SB", onPress: this.sortRotoStandingsBySB },
      { title: "OBP", onPress: this.sortRotoStandingsByOBP },
      { title: "SO", onPress: this.sortRotoStandingsBySO },
      { title: "QS", onPress: this.sortRotoStandingsByQS },
      { title: "W", onPress: this.sortRotoStandingsByW },
      { title: "SV", onPress: this.sortRotoStandingsBySV },
      { title: "ERA", onPress: this.sortRotoStandingsByERA },
      { title: "WHIP", onPress: this.sortRotoStandingsByWHIP },
    ];
    const rotoStatsHeaderRow = rotoStatsHeaderRowMap.map(
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
          <Text style={{ alignSelf: "flex-start" }}>Trifecta Standings</Text>
          <Row
            data={trifectaStandingsHeaderRow}
            height={trifectaStandingsHeaderRowHeight}
            totalWidth={trifectaStandingsTotalWidth}
            widthArray={trifectaStandingsWidthArray}
            rowStyle={{ backgroundColor: "#BEBEBE" }}
          />
          <Rows
            data={trifectaStandings}
            totalheight={trifectaStandingsTotalHeight}
            totalwidth={trifectaStandingsTotalWidth}
            widthArray={trifectaStandingsWidthArray}
            objectKeys={trifectaStandingsObjectKeys}
          />
        </View>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>H2H Standings</Text>
          <Row
            data={h2hStandingsHeaderRow}
            height={h2hStandingsHeaderRowHeight}
            totalwidth={h2hStandingsTotalWidth}
            widthArray={h2hStandingsWidthArray}
            rowStyle={{ backgroundColor: "#BEBEBE" }}
            numberOfLines={2}
          />
          <Rows
            data={h2hStandings}
            totalheight={h2hStandingsTotalHeight}
            totalwidth={h2hStandingsTotalWidth}
            widthArray={h2hStandingsWidthArray}
            objectKeys={h2hStandingsObjectKeys}
          />
        </View>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>Roto Standings</Text>
          <Row
            data={rotoStandingsHeaderRow}
            height={rotoStandingsHeaderRowHeight}
            totalwidth={rotoStandingsTotalWidth}
            widthArray={rotoStandingsWidthArray}
            rowStyle={{ backgroundColor: "#BEBEBE" }}
            numberOfLines={2}
          />
          <Rows
            data={rotoStandings}
            totalheight={rotoStandingsTotalHeight}
            totalwidth={rotoStandingsTotalWidth}
            widthArray={rotoStandingsWidthArray}
            objectKeys={rotoStandingsObjectKeys}
            numberOfLines={2}
          />
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <Text style={{ alignSelf: "flex-start" }}>Roto Stats</Text>
            <Row
              data={rotoStatsHeaderRow}
              height={rotoStatsHeaderRowHeight}
              totalwidth={rotoStatsTotalWidth}
              widthArray={rotoStatsWidthArray}
              rowStyle={{ backgroundColor: "#BEBEBE" }}
              numberOfLines={2}
            />
            <Rows
              data={rotoStats}
              totalheight={rotoStatsTotalHeight}
              totalwidth={rotoStatsTotalWidth}
              widthArray={rotoStatsWidthArray}
              objectKeys={rotoStatsObjectKeys}
              numberOfLines={2}
            />
          </View>
        </View>
        <Button
          title="Go to 2019 Basketball Standings!"
          onPress={() =>
            navigation.navigate("BasketballStandings", { year: "2019" })
          }
        />
        <Button
          title="Go to 2019 Football Standings!"
          onPress={() =>
            navigation.navigate("FootballStandings", { year: "2019" })
          }
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
});

const mapStateToProps = state => {
  const {
    getTrifectaStandings,
    getH2HStandings,
    getRotoStandings,
    getRotoStats,
    getLastScraped,
  } = getBaseballStandingsStateSelectors(state);

  return {
    lastScraped: getLastScraped(),
    trifectaStandings: getTrifectaStandings(),
    h2hStandings: getH2HStandings(),
    rotoStandings: getRotoStandings(),
    rotoStats: getRotoStats(),
  };
};

const mapDispatchToProps = {
  scrapeBaseballStandings,
  displayBaseballStandings,
  sortTable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseballStandings);
