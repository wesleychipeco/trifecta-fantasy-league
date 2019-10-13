import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { LinkText } from "../components/LinkText";
import { Navbar } from "../components/Navbar";
import { getMatchupsStateSelectors } from "../store/matchups/matchupsReducer";
import { displayMatchups, sortTable } from "../store/matchups/matchupsActions";
import { returnMongoCollection } from "../databaseManagement";
import { sortArrayBy, isYear1BeforeYear2 } from "../utils";
import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/matchups";
import { matchupsStyles as styles } from "../styles/globalStyles";

class Matchups extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: null,
      basketballSeasonEnded: null,
      baseballSeasonEnded: null,
      footballSeasonEnded: null,
      totalMatchups: {
        sortedColumn: null,
        highToLow: null,
      },
      basketballMatchups: {
        sortedColumn: null,
        highToLow: null,
      },
      baseballMatchups: {
        sortedColumn: null,
        highToLow: null,
      },
      footballMatchups: {
        sortedColumn: null,
        highToLow: null,
      },
    };
  }

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = () => {
    // const { lastScraped, navigation } = this.props;
    const { navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");
    const ownerNumber = navigation.getParam(
      "ownerNumber",
      "No ownerNumber was defined!"
    );

    const seasonVariablesCollection = returnMongoCollection("seasonVariables");
    seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then(seasonVariables => {
        const { currentYear } = seasonVariables[0];
        const { displayMatchups } = this.props;

        if (isYear1BeforeYear2(year, currentYear)) {
          displayMatchups(year, ownerNumber);
        }
        // else {
        //   const defaultSortColumn = inSeason
        //     ? "trifectaPoints"
        //     : "totalTrifectaPoints";

        //   this.setState({
        //     seasonStarted,
        //     inSeason,
        //     trifectaStandings: {
        //       sortedColumn: defaultSortColumn,
        //       highToLow: true,
        //     },
        //   });

        //   if (seasonStarted) {
        //     if (inSeason && !lastScraped) {
        //       scrapeBaseballStandings(year);
        //     } else {
        //       displayBaseballStandings(year, defaultSortColumn);
        //     }
        //   }
        // }
      });
  };

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

  sortTotalMatchupsByBasketballWinPer = () => {
    const { totalMatchups } = this.props;
    this.sortTableByColumn(totalMatchups, "basketballWinPer", "totalMatchups");
  };

  sortTotalMatchupsByBaseballWinPer = () => {
    const { totalMatchups } = this.props;
    this.sortTableByColumn(totalMatchups, "baseballWinPer", "totalMatchups");
  };

  sortTotalMatchupsByFootballWinPer = () => {
    const { totalMatchups } = this.props;
    this.sortTableByColumn(totalMatchups, "footballWinPer", "totalMatchups");
  };

  sortTotalMatchupsByTotalWinPer = () => {
    const { totalMatchups } = this.props;
    this.sortTableByColumn(totalMatchups, "totalWinPer", "totalMatchups");
  };

  sortBasketballMatchupsByWins = () => {
    const { basketballMatchups } = this.props;
    this.sortTableByColumn(basketballMatchups, "wins", "basketballMatchups");
  };

  sortBasketballMatchupsByLosses = () => {
    const { basketballMatchups } = this.props;
    this.sortTableByColumn(basketballMatchups, "losses", "basketballMatchups");
  };

  sortBasketballMatchupsByTies = () => {
    const { basketballMatchups } = this.props;
    this.sortTableByColumn(basketballMatchups, "ties", "basketballMatchups");
  };

  sortBasketballMatchupsByWinPer = () => {
    const { basketballMatchups } = this.props;
    this.sortTableByColumn(basketballMatchups, "winPer", "basketballMatchups");
  };

  sortBaseballMatchupsByWins = () => {
    const { baseballMatchups } = this.props;
    this.sortTableByColumn(baseballMatchups, "wins", "baseballMatchups");
  };

  sortBaseballMatchupsByLosses = () => {
    const { baseballMatchups } = this.props;
    this.sortTableByColumn(baseballMatchups, "losses", "baseballMatchups");
  };

  sortBaseballMatchupsByTies = () => {
    const { baseballMatchups } = this.props;
    this.sortTableByColumn(baseballMatchups, "ties", "baseballMatchups");
  };

  sortFootballMatchupsByWinPer = () => {
    const { baseballMatchups } = this.props;
    this.sortTableByColumn(baseballMatchups, "winPer", "baseballMatchups");
  };

  sortFootballMatchupsByWins = () => {
    const { footballMatchups } = this.props;
    this.sortTableByColumn(footballMatchups, "wins", "footballMatchups");
  };

  sortFootballMatchupsByLosses = () => {
    const { footballMatchups } = this.props;
    this.sortTableByColumn(footballMatchups, "losses", "footballMatchups");
  };

  sortFootballMatchupsByTies = () => {
    const { footballMatchups } = this.props;
    this.sortTableByColumn(footballMatchups, "ties", "footballMatchups");
  };

  sortFootballMatchupsByWinPer = () => {
    const { footballMatchups } = this.props;
    this.sortTableByColumn(footballMatchups, "winPer", "footballMatchups");
  };

  sortFootballMatchupsByPointsFor = () => {
    const { footballMatchups } = this.props;
    this.sortTableByColumn(footballMatchups, "pointsFor", "footballMatchups");
  };

  sortFootballMatchupsByPointsAgainst = () => {
    const { footballMatchups } = this.props;
    this.sortTableByColumn(
      footballMatchups,
      "pointsAgainst",
      "footballMatchups"
    );
  };

  sortFootballMatchupsByPointsDiff = () => {
    const { footballMatchups } = this.props;
    this.sortTableByColumn(footballMatchups, "pointsDiff", "footballMatchups");
  };

  renderHeaderRowColumn = ({ title, onPress }) => {
    return (
      <LinkText
        key={title}
        title={title}
        onPress={onPress}
        textStyles={styles.headerText}
      />
    );
  };

  convertSubtractRevert = year2 => {
    const year1 = Number(year2) - 1;
    return [year1.toString(), year2.toString()];
  };

  nameMatching = ownerNumber => {
    let ownerName;
    switch (ownerNumber) {
      case "1":
        ownerName = "Marcus Lam";
        break;
      case "2":
        ownerName = "Wesley Chipeco";
        break;
      case "3":
        ownerName = "Kevin Okamoto & Joshua Liu";
        break;
      case "4":
        ownerName = "Bryan Kuh";
        break;
      case "5":
        ownerName = "Joshua Apostol";
        break;
      case "6":
        ownerName = "Joshua Aguirre";
        break;
      case "7":
        ownerName = "Tim Fong";
        break;
      case "8":
        ownerName = "Ryan Tomimitsu";
        break;
      case "9":
        ownerName = "Nick Wang";
        break;
      case "10":
        ownerName = "Wayne Fong";
        break;
      default:
        ownerName = "";
        break;
    }
    return ownerName;
  };

  render() {
    const {
      navigation,
      totalMatchups,
      basketballMatchups,
      baseballMatchups,
      footballMatchups,
    } = this.props;
    const year = navigation.getParam("year", "No year was defined!");
    const ownerNumber = navigation.getParam("ownerNumber", "No owner number");

    if (
      !totalMatchups ||
      !basketballMatchups ||
      !baseballMatchups ||
      !footballMatchups
    )
      return null;

    ///// Total Matchups /////
    const totalMatchupsHeaderRowHeight = 75;
    const totalMatchupsTotalHeight = 450;
    const totalMatchupsTotalWidth = 600;
    const totalMatchupsWidthArray = [200, 100, 100, 100, 100];
    const totalMatchupsObjectKeys = [
      "ownerNames",
      "basketballWinPer",
      "baseballWinPer",
      "footballWinPer",
      "totalWinPer",
    ];

    const totalMatchupsHeaderRowMap = [
      { title: "Owner Name(s)", onPress: this.noop },
      {
        title: "Basketball Win %",
        onPress: this.sortTotalMatchupsByBasketballWinPer,
      },
      {
        title: "Baseball Win %",
        onPress: this.sortTotalMatchupsByBaseballWinPer,
      },
      {
        title: "Football Win %",
        onPress: this.sortTotalMatchupsByFootballWinPer,
      },
      { title: "Total Win %", onPress: this.sortTotalMatchupsByTotalWinPer },
    ];
    const totalMatchupsHeaderRow = totalMatchupsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    ///// Sports Matchups /////
    const sportsMatchupsHeaderRowHeight = 75;
    const sportsMatchupsTotalHeight = 450;
    const sportsMatchupsTotalWidth = 600;
    const sportsMatchupsWidthArray = [200, 100, 100, 100, 100];
    const sportsMatchupsObjectKeys = [
      "ownerNames",
      "wins",
      "losses",
      "ties",
      "winPer",
    ];

    const footballMatchupsTotalWidth = 900;
    const footballMatchupsWidthArray = sportsMatchupsWidthArray.concat([
      100,
      100,
      100,
    ]);
    const footballMatchupsObjectKeys = sportsMatchupsObjectKeys.concat([
      "pointsFor",
      "pointsAgainst",
      "pointsDiff",
    ]);

    const basketballMatchupsHeaderRowMap = [
      { title: "Owner Name(s)", onPress: this.noop },
      {
        title: "Wins",
        onPress: this.sortBasketballMatchupsByWins,
      },
      {
        title: "Losses",
        onPress: this.sortBasketballMatchupsByLosses,
      },
      {
        title: "Ties",
        onPress: this.sortBasketballMatchupsByTies,
      },
      { title: "Win %", onPress: this.sortBasketballMatchupsByWinPer },
    ];
    const basketballMatchupsHeaderRow = basketballMatchupsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    const baseballMatchupsHeaderRowMap = [
      { title: "Owner Name(s)", onPress: this.noop },
      {
        title: "Wins",
        onPress: this.sortBaseballMatchupsByWins,
      },
      {
        title: "Losses",
        onPress: this.sortBaseballMatchupsByLosses,
      },
      {
        title: "Ties",
        onPress: this.sortBaseballMatchupsByTies,
      },
      { title: "Win %", onPress: this.sortBaseballMatchupsByWinPer },
    ];
    const baseballMatchupsHeaderRow = baseballMatchupsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    const footballMatchupsHeaderRowMap = [
      { title: "Owner Name(s)", onPress: this.noop },
      {
        title: "Wins",
        onPress: this.sortFootballMatchupsByWins,
      },
      {
        title: "Losses",
        onPress: this.sortFootballMatchupsByLosses,
      },
      {
        title: "Ties",
        onPress: this.sortFootballMatchupsByTies,
      },
      { title: "Win %", onPress: this.sortFootballMatchupsByWinPer },
      { title: "Points For", onPress: this.sortFootballMatchupsByPointsFor },
      {
        title: "Points Against",
        onPress: this.sortFootballMatchupsByPointsAgainst,
      },
      {
        title: "Point Differential",
        onPress: this.sortFootballMatchupsByPointsDiff,
      },
    ];
    const footballMatchupsHeaderRow = footballMatchupsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    const ownerName = this.nameMatching(ownerNumber);
    let title;
    if (isYear1BeforeYear2(year, "2019")) {
      const yearArray = this.convertSubtractRevert(year);
      title = `${ownerName}'s ${yearArray[0]}-${
        yearArray[1]
      } Owner Head-to-Head Matchups`;
    } else {
      title = `${ownerName}'s ${year} Owner Head-to-Head Matchups`;
    }

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.tables}>
          <View style={styles.table}>
            <Text style={styles.subtext}>Total Matchups</Text>
            <Row
              data={totalMatchupsHeaderRow}
              height={totalMatchupsHeaderRowHeight}
              totalWidth={totalMatchupsTotalWidth}
              widthArray={totalMatchupsWidthArray}
              rowStyle={styles.header}
            />
            <Rows
              data={totalMatchups}
              totalheight={totalMatchupsTotalHeight}
              totalwidth={totalMatchupsTotalWidth}
              widthArray={totalMatchupsWidthArray}
              objectKeys={totalMatchupsObjectKeys}
            />
          </View>
          <View style={styles.table}>
            <Text style={styles.subtext}>Basketball Matchups</Text>
            <Row
              data={basketballMatchupsHeaderRow}
              height={sportsMatchupsHeaderRowHeight}
              totalWidth={sportsMatchupsTotalWidth}
              widthArray={sportsMatchupsWidthArray}
              rowStyle={styles.header}
            />
            <Rows
              data={basketballMatchups}
              totalheight={sportsMatchupsTotalHeight}
              totalwidth={sportsMatchupsTotalWidth}
              widthArray={sportsMatchupsWidthArray}
              objectKeys={sportsMatchupsObjectKeys}
            />
          </View>
          <View style={styles.table}>
            <Text style={styles.subtext}>Baseball Matchups</Text>
            <Row
              data={baseballMatchupsHeaderRow}
              height={sportsMatchupsHeaderRowHeight}
              totalWidth={sportsMatchupsTotalWidth}
              widthArray={sportsMatchupsWidthArray}
              rowStyle={styles.header}
            />
            <Rows
              data={baseballMatchups}
              totalheight={sportsMatchupsTotalHeight}
              totalwidth={sportsMatchupsTotalWidth}
              widthArray={sportsMatchupsWidthArray}
              objectKeys={sportsMatchupsObjectKeys}
            />
          </View>
          <View style={styles.table}>
            <Text style={styles.subtext}>Football Matchups</Text>
            <Row
              data={footballMatchupsHeaderRow}
              height={sportsMatchupsHeaderRowHeight}
              totalWidth={footballMatchupsTotalWidth}
              widthArray={footballMatchupsWidthArray}
              rowStyle={styles.header}
            />
            <Rows
              data={footballMatchups}
              totalheight={sportsMatchupsTotalHeight}
              totalwidth={footballMatchupsTotalWidth}
              widthArray={footballMatchupsWidthArray}
              objectKeys={footballMatchupsObjectKeys}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    getTotalMatchups,
    getBasketballMatchups,
    getBaseballMatchups,
    getFootballMatchups,
  } = getMatchupsStateSelectors(state);

  return {
    totalMatchups: getTotalMatchups(),
    basketballMatchups: getBasketballMatchups(),
    baseballMatchups: getBaseballMatchups(),
    footballMatchups: getFootballMatchups(),
  };
};

const mapDispatchToProps = {
  displayMatchups,
  sortTable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Matchups);
