import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
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
import { sortArrayBy } from "../utils";
import { LinkText } from "../components/LinkText";

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
        const { seasonStarted, inSeason } = seasonVariables[0].football;

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
            this.props.scrapeFootballStandings(year);
          } else {
            this.props.displayFootballStandings(year);
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
    const { navigation, footballStandings, lastScraped } = this.props;
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
    const totalWidth = inSeason ? 900 : 1100;
    const widthArray = [200, 100, 100, 100, 100, 100, 100, 100];
    const objectKeys = [
      "teamName",
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

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Football Standings!</Text>
        <Text>{lastScraped}</Text>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>Football Standings</Text>
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

        <Button
          title="Go to 2019 Basketball Standings!"
          onPress={() =>
            navigation.navigate("BasketballStandings", { year: "2019" })
          }
        />
        <Button
          title="Go to 2019 Baseball Standings!"
          onPress={() =>
            navigation.navigate("BaseballStandings", { year: "2019" })
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
