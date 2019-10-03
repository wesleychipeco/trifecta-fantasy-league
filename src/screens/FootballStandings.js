import React, { PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";

import { getFootballStandingsStateSelectors } from "../store/footballStandings/footballStandingsReducer";
import {
  scrapeFootballStandings,
  displayFootballStandings,
  sortTable,
} from "../store/footballStandings/footballStandingsActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/footballStandings";
import { returnMongoCollection } from "../databaseManagement";
import { sortArrayBy, isYearInPast } from "../utils";
import { LinkText } from "../components/LinkText";
import { Navbar } from "../components/Navbar";

class FootballStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      seasonStarted: null,
      inSeason: null,
      footballStandings: {
        sortedColumn: null,
        highToLow: null,
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
        const { currentYear } = seasonVariables[0];
        const { seasonStarted, inSeason } = seasonVariables[0].football;
        const {
          scrapeFootballStandings,
          displayFootballStandings,
        } = this.props;

        if (isYearInPast(year, currentYear)) {
          displayFootballStandings(year);
        } else {
          const defaultSortColumn = inSeason
            ? "trifectaPoints"
            : "totalTrifectaPoints";

          this.setState({
            seasonStarted,
            inSeason,
            footballStandings: {
              sortedColumn: defaultSortColumn,
              highToLow: true,
            },
          });

          if (seasonStarted) {
            if (inSeason && !lastScraped) {
              scrapeFootballStandings(year);
            } else {
              displayFootballStandings(year, defaultSortColumn);
            }
          }
        }
      });
  }

  sortTableByColumn = (tableArray, columnKey) => {
    const { sortTable } = this.props;
    const { sortedColumn, highToLow } = this.state.footballStandings;

    const tableArraySorted = [...tableArray];

    if (sortedColumn === columnKey) {
      this.setState({
        footballStandings: {
          sortedColumn: columnKey,
          highToLow: !highToLow,
        },
      });
      sortTable(sortArrayBy(tableArraySorted, columnKey, !highToLow));
    } else {
      const columnDefaultSortDirection =
        tableDefaultSortDirections.footballStandings[columnKey];
      this.setState({
        footballStandings: {
          sortedColumn: columnKey,
          highToLow: columnDefaultSortDirection,
        },
      });
      sortTable(
        sortArrayBy(tableArraySorted, columnKey, columnDefaultSortDirection)
      );
    }
  };

  noop = () => {};

  sortFootballStandingsByWins = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "wins");
  };

  sortFootballStandingsByLosses = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "losses");
  };

  sortFootballStandingsByTies = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "ties");
  };

  sortFootballStandingsByWinPer = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "winPer");
  };

  sortFootballStandingsByPointsFor = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "pointsFor");
  };

  sortFootballStandingsByPointsAgainst = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "pointsAgainst");
  };

  sortFootballStandingsByTrifectaPoints = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "trifectaPoints");
  };

  sortFootballStandingsByPlayoffPoints = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "playoffPoints");
  };

  sortFootballStandingsByTotalTrifectaPoints = () => {
    const { footballStandings } = this.props;
    this.sortTableByColumn(footballStandings, "totalTrifectaPoints");
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
    const { navigation, footballStandings } = this.props;
    const { seasonStarted, inSeason } = this.state;

    if (seasonStarted === false) {
      return (
        <View>
          <Text>Not in season yet!</Text>
        </View>
      );
    }

    if (!footballStandings) {
      return null;
    }

    const headerRowHeight = 75;
    const totalHeight = 500;
    const totalWidth = inSeason ? 1100 : 1300;
    const widthArray = [200, 200, 100, 100, 100, 100, 100, 100, 100];
    const objectKeys = [
      "teamName",
      "ownerNames",
      "wins",
      "losses",
      "ties",
      "winPer",
      "pointsFor",
      "pointsAgainst",
      "trifectaPoints",
    ];

    const headerRowMap = [
      { title: "Team Name", onPress: this.noop },
      { title: "Owner(s)", onPress: this.noop },
      { title: "Wins", onPress: this.sortFootballStandingsByWins },
      { title: "Losses", onPress: this.sortFootballStandingsByLosses },
      { title: "Ties", onPress: this.sortFootballStandingsByTies },
      { title: "Win %", onPress: this.sortFootballStandingsByWinPer },
      { title: "Points For", onPress: this.sortFootballStandingsByPointsFor },
      {
        title: "Points Against",
        onPress: this.sortFootballStandingsByPointsAgainst,
      },
      {
        title: "Trifecta Points",
        onPress: this.sortFootballStandingsByTrifectaPoints,
      },
    ];

    if (!inSeason) {
      widthArray.push(100, 100);
      objectKeys.push("playoffPoints", "totalTrifectaPoints");
      headerRowMap.push(
        {
          title: "Playoff Points",
          onPress: this.sortFootballStandingsByPlayoffPoints,
        },
        {
          title: "Total Trifecta Points",
          onPress: this.sortFootballStandingsByTotalTrifectaPoints,
        }
      );
    }
    const headerRow = headerRowMap.map(this.renderHeaderRowColumn);
    const year = navigation.getParam("year", "No year was defined!");
    const title = `${year} Football Standings!`;

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <Text style={styles.welcome}>{title}</Text>
        {/* <Text>{lastScraped}</Text> */}
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          {/* <Text style={{ alignSelf: "flex-start" }}>Football Standings</Text> */}
          <Row
            data={headerRow}
            height={headerRowHeight}
            totalWidth={totalWidth}
            widthArray={widthArray}
            rowStyle={{ backgroundColor: "#BEBEBE" }}
          />
          <Rows
            data={footballStandings}
            totalheight={totalHeight}
            totalwidth={totalWidth}
            widthArray={widthArray}
            objectKeys={objectKeys}
          />
        </View>
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
    getFootballStandings,
    getLastScraped,
  } = getFootballStandingsStateSelectors(state);

  return {
    footballStandings: getFootballStandings(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  scrapeFootballStandings,
  displayFootballStandings,
  sortTable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FootballStandings);
