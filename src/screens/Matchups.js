import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { LinkText } from "../components/LinkText";
import { Navbar } from "../components/Navbar";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { MatchupsDropdown } from "../components/MatchupsDropdown";
import { getMatchupsStateSelectors } from "../store/matchups/matchupsReducer";
import {
  scrapeMatchups,
  displayMatchups,
  sortTable,
} from "../store/matchups/matchupsActions";
import { returnMongoCollection } from "../databaseManagement";
import { sortArrayBy, isYear1BeforeYear2, isEmptyArray } from "../utils";
import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/matchups";
import { standingsStyles as styles } from "../styles/globalStyles";

class Matchups extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: null,
      ownerNames: null,
      basketballSeasonEnded: null,
      baseballSeasonEnded: null,
      footballSeasonEnded: null,
      totalMatchups: {
        sortedColumn: "totalWinPer",
        highToLow: true,
      },
      basketballMatchups: {
        sortedColumn: "winPer",
        highToLow: true,
      },
      baseballMatchups: {
        sortedColumn: "winPer",
        highToLow: true,
      },
      footballMatchups: {
        sortedColumn: "winPer",
        highToLow: true,
      },
    };
  }

  componentDidMount() {
    this.retrieveData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { year } = this.props.match.params;
    this.setState({
      year,
    });

    if (prevState.year !== this.state.year) {
      this.retrieveData(prevState.ownerNames);
    }
  }

  isSeasonEnded = (seasonVariables) => {
    const { seasonStarted, inSeason } = seasonVariables;
    return seasonStarted === true && inSeason === false ? true : false;
  };

  retrieveData = async (prevOwnerNames) => {
    const { match, displayMatchups } = this.props;
    const { year, teamNumber } = match.params;

    const teamOwnerNamesCollection = await returnMongoCollection(
      "allTimeTeams"
    );

    teamOwnerNamesCollection
      .find({ teamNumber }, { projection: { ownerNames: 1 } })
      .asArray()
      .then((docs) => {
        this.setState({ ownerNames: docs[0].ownerNames });
        this.setState({ year });
        displayMatchups(year, teamNumber);
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

  sortBaseballMatchupsByWinPer = () => {
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

  convertSubtractRevert = (year2) => {
    const year1 = Number(year2) - 1;
    return [year1.toString(), year2.toString()];
  };

  shouldRenderCaption = () => {
    const { year } = this.props.match;

    if (year === "all") {
      return (
        <View>
          <Text style={styles.subtext}>
            NOTE: "All" matchups only consists of completed Trifecta seasons
          </Text>
        </View>
      );
    }
  };

  shouldRenderTotalMatchups = () => {
    const { totalMatchups } = this.props;

    ///// Total Matchups /////
    const totalMatchupsHeaderRowHeight = 75;
    const totalMatchupsTotalHeight = totalMatchups.length * 50;
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

    if (totalMatchups.length > 0) {
      return (
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
      );
    }
    return null;
  };

  isFootball = (sport) => sport === "Football";

  shouldRenderSportsMatchups = (sport, headerRow, sportsMatchups) => {
    ///// Sports Matchups /////
    const defaultSportsMatchupsWidthArray = [200, 100, 100, 100, 100];
    const defaultSportsObjectKeys = [
      "ownerNames",
      "wins",
      "losses",
      "ties",
      "winPer",
    ];

    const sportsMatchupsHeaderRowHeight = 75;
    const sportsMatchupsTotalHeight = sportsMatchups.length * 50;
    const sportsMatchupsTotalWidth = !this.isFootball(sport) ? 600 : 900;
    const sportsMatchupsWidthArray = !this.isFootball(sport)
      ? defaultSportsMatchupsWidthArray
      : defaultSportsMatchupsWidthArray.concat([100, 100, 100]);
    const sportsMatchupsObjectKeys = !this.isFootball(sport)
      ? defaultSportsObjectKeys
      : defaultSportsObjectKeys.concat([
          "pointsFor",
          "pointsAgainst",
          "pointsDiff",
        ]);

    if (isEmptyArray(sportsMatchups)) {
      return (
        <View style={styles.table}>
          <Text style={styles.title}>{`${sport} season not completed`}</Text>
        </View>
      );
    }

    return (
      <View style={styles.table}>
        <Text style={styles.subtext}>{`${sport} Matchups`}</Text>
        <Row
          data={headerRow}
          height={sportsMatchupsHeaderRowHeight}
          totalWidth={sportsMatchupsTotalWidth}
          widthArray={sportsMatchupsWidthArray}
          rowStyle={styles.header}
        />
        <Rows
          data={sportsMatchups}
          totalheight={sportsMatchupsTotalHeight}
          totalwidth={sportsMatchupsTotalWidth}
          widthArray={sportsMatchupsWidthArray}
          objectKeys={sportsMatchupsObjectKeys}
        />
      </View>
    );
  };

  render() {
    const {
      navigation,
      basketballMatchups,
      baseballMatchups,
      footballMatchups,
      match,
    } = this.props;
    const { ownerNames } = this.state;
    const { year, teamNumber } = match.params;

    if (
      isEmptyArray(basketballMatchups) &&
      isEmptyArray(baseballMatchups) &&
      isEmptyArray(footballMatchups)
    ) {
      return <LoadingIndicator />;
    }

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

    let title;
    if (year === "all") {
      title = `${ownerNames}'s All-Time Owner Head-to-Head Matchups`;
    } else {
      if (isYear1BeforeYear2(year, "2019")) {
        const yearArray = this.convertSubtractRevert(year);
        title = `${ownerNames}'s ${yearArray.join(
          " - "
        )} Owner Head-to-Head Matchups`;
      } else {
        title = `${ownerNames}'s ${year} Owner Head-to-Head Matchups`;
      }
    }

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.title}>{title}</Text>
            {this.shouldRenderCaption()}
          </View>
          <View style={styles.dropdown}>
            <MatchupsDropdown navigation={navigation} teamNumber={teamNumber} />
          </View>
        </View>
        <View style={styles.tables}>
          {this.shouldRenderTotalMatchups()}
          {this.shouldRenderSportsMatchups(
            "Basketball",
            basketballMatchupsHeaderRow,
            basketballMatchups
          )}
          {this.shouldRenderSportsMatchups(
            "Baseball",
            baseballMatchupsHeaderRow,
            baseballMatchups
          )}
          {this.shouldRenderSportsMatchups(
            "Football",
            footballMatchupsHeaderRow,
            footballMatchups
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    getTotalMatchups,
    getBasketballMatchups,
    getBaseballMatchups,
    getFootballMatchups,
    getLastScraped,
  } = getMatchupsStateSelectors(state);

  return {
    totalMatchups: getTotalMatchups(),
    basketballMatchups: getBasketballMatchups(),
    baseballMatchups: getBaseballMatchups(),
    footballMatchups: getFootballMatchups(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  scrapeMatchups,
  displayMatchups,
  sortTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(Matchups);
