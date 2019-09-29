import React, { PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { Navbar } from "../components/Navbar";

import { getBasketballStandingsStateSelectors } from "../store/basketballStandings/basketballStandingsReducer";
import {
  scrapeBasketballStandings,
  displayBasketballStandings,
  sortTable,
} from "../store/basketballStandings/basketballStandingsActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/basketballStandings";
import { sortArrayBy, isYearInPast } from "../utils";
import { LinkText } from "../components/LinkText";
import { returnMongoCollection } from "../databaseManagement";

class BasketballStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      seasonStarted: null,
      inSeason: null,
      basketballStandings: {
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
        const { seasonStarted, inSeason } = seasonVariables[0].basketball;
        const {
          scrapeBasketballStandings,
          displayBasketballStandings,
        } = this.props;

        if (isYearInPast(year, currentYear)) {
          displayBasketballStandings(year);
        } else {
          const defaultSortColumn = inSeason
            ? "trifectaPoints"
            : "totalTrifectaPoints";

          this.setState({
            seasonStarted,
            inSeason,
            basketballStandings: {
              sortedColumn: defaultSortColumn,
              highToLow: true,
            },
          });

          if (seasonStarted) {
            if (inSeason && !lastScraped) {
              scrapeBasketballStandings(year);
            } else {
              displayBasketballStandings(year, defaultSortColumn);
            }
          }
        }
      });
  }

  sortTableByColumn = (tableArray, columnKey) => {
    const { sortTable } = this.props;
    const { sortedColumn, highToLow } = this.state.basketballStandings;

    const tableArraySorted = [...tableArray];

    if (sortedColumn === columnKey) {
      this.setState({
        basketballStandings: {
          sortedColumn: columnKey,
          highToLow: !highToLow,
        },
      });
      sortTable(sortArrayBy(tableArraySorted, columnKey, !highToLow));
    } else {
      const columnDefaultSortDirection =
        tableDefaultSortDirections.basketballStandings[columnKey];
      this.setState({
        basketballStandings: {
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

  sortBasketballStandingsByWins = () => {
    const { basketballStandings } = this.props;
    this.sortTableByColumn(basketballStandings, "wins");
  };

  sortBasketballStandingsByLosses = () => {
    const { basketballStandings } = this.props;
    this.sortTableByColumn(basketballStandings, "losses");
  };

  sortBasketballStandingsByTies = () => {
    const { basketballStandings } = this.props;
    this.sortTableByColumn(basketballStandings, "ties");
  };

  sortBasketballStandingsByWinPer = () => {
    const { basketballStandings } = this.props;
    this.sortTableByColumn(basketballStandings, "winPer");
  };

  sortBasketballStandingsByTrifectaPoints = () => {
    const { basketballStandings } = this.props;
    this.sortTableByColumn(basketballStandings, "trifectaPoints");
  };

  sortBasketballStandingsByPlayoffPoints = () => {
    const { basketballStandings } = this.props;
    this.sortTableByColumn(basketballStandings, "playoffPoints");
  };

  sortBasketballStandingsByTotalTrifectaPoints = () => {
    const { basketballStandings } = this.props;
    this.sortTableByColumn(basketballStandings, "totalTrifectaPoints");
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
    const { navigation, basketballStandings } = this.props;
    const { seasonStarted, inSeason } = this.state;

    if (seasonStarted === false) {
      return (
        <View>
          <Text>Not in season yet!</Text>
        </View>
      );
    }

    if (!basketballStandings) {
      return null;
    }

    const headerRowHeight = 75;
    const totalHeight = 500;
    const totalWidth = inSeason ? 900 : 1100;
    const widthArray = [200, 200, 100, 100, 100, 100, 100];
    const objectKeys = [
      "teamName",
      "ownerNames",
      "wins",
      "losses",
      "ties",
      "winPer",
      "trifectaPoints",
    ];

    const headerRowMap = [
      { title: "Team Name", onPress: this.noop },
      { title: "Owner(s)", onPress: this.noop },
      { title: "Wins", onPress: this.sortBasketballStandingsByWins },
      { title: "Losses", onPress: this.sortBasketballStandingsByLosses },
      { title: "Ties", onPress: this.sortBasketballStandingsByTies },
      { title: "Win %", onPress: this.sortBasketballStandingsByWinPer },
      {
        title: "Trifecta Points",
        onPress: this.sortBasketballStandingsByTrifectaPoints,
      },
    ];
    // If not in season, add in playoff points and total trifecta points
    if (!inSeason) {
      widthArray.push(100, 100);
      objectKeys.push("playoffPoints", "totalTrifectaPoints");
      headerRowMap.push(
        {
          title: "Playoff Points",
          onPress: this.sortBasketballStandingsByPlayoffPoints,
        },
        {
          title: "Total Trifecta Points",
          onPress: this.sortBasketballStandingsByTotalTrifectaPoints,
        }
      );
    }
    const headerRow = headerRowMap.map(this.renderHeaderRowColumn);

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <Text style={styles.welcome}>Basketball Standings!</Text>
        {/* <Text>{lastScraped}</Text> */}
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>Basketball Standings</Text>
          <Row
            data={headerRow}
            height={headerRowHeight}
            totalWidth={totalWidth}
            widthArray={widthArray}
            rowStyle={{ backgroundColor: "#BEBEBE" }}
          />
          <Rows
            data={basketballStandings}
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
    getBasketballStandings,
    getLastScraped,
  } = getBasketballStandingsStateSelectors(state);

  return {
    basketballStandings: getBasketballStandings(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  scrapeBasketballStandings,
  displayBasketballStandings,
  sortTable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasketballStandings);
