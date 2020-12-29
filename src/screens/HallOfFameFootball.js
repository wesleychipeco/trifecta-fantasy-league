import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { Navbar } from "../components/Navbar";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { getFootballHallOfFameStateSelectors } from "../store/hallOfFame/footballHallOfFameReducer";
import {
  displayHallOfFame,
  sortFootballTable,
} from "../store/hallOfFame/hallOfFameActions";
import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/hallOfFame/football";
import { standingsStyles as styles } from "../styles/globalStyles";
import { isEmptyArray, sum, sortArrayBy } from "../utils";
import { LinkText } from "../components/LinkText";

export class HallOfFameFootball extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      allTimeRecords: {
        sortedColumn: "winPer",
        highToLow: true,
      },
      pastChampions: {
        sortedColumn: "year",
        highToLow: false,
      },
      bestH2H: {
        sortedColumn: "winPer",
        highToLow: true,
      },
      bestWeeks: {
        sortedColumn: "pointsFor",
        highToLow: true,
      },
    };
  }

  componentDidMount() {
    this.props.displayHallOfFame("football");
  }

  noop = () => {};

  sortTableByColumn = (tableArray, columnKey, tableType) => {
    const { sortFootballTable } = this.props;
    const { sortedColumn, highToLow } = this.state[tableType];
    const tableArraySorted = [...tableArray];

    if (sortedColumn === columnKey) {
      this.setState({
        [tableType]: {
          sortedColumn: columnKey,
          highToLow: !highToLow,
        },
      });
      sortFootballTable([
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
      sortFootballTable([
        sortArrayBy(tableArraySorted, columnKey, columnDefaultSortDirection),
        tableType,
      ]);
    }
  };

  // All-Time Records Table Sort methods
  sortAllTimeRecordsBySeasons = () => {
    const { allTimeRecords } = this.props;
    this.sortTableByColumn(allTimeRecords, "seasons", "allTimeRecords");
  };

  sortAllTimeRecordsByWins = () => {
    const { allTimeRecords } = this.props;
    this.sortTableByColumn(allTimeRecords, "wins", "allTimeRecords");
  };

  sortAllTimeRecordsByLosses = () => {
    const { allTimeRecords } = this.props;
    this.sortTableByColumn(allTimeRecords, "losses", "allTimeRecords");
  };

  sortAllTimeRecordsByTies = () => {
    const { allTimeRecords } = this.props;
    this.sortTableByColumn(allTimeRecords, "ties", "allTimeRecords");
  };

  sortAllTimeRecordsByWinPer = () => {
    const { allTimeRecords } = this.props;
    this.sortTableByColumn(allTimeRecords, "winPer", "allTimeRecords");
  };

  sortAllTimeRecordsByPointsFor = () => {
    const { allTimeRecords } = this.props;
    this.sortTableByColumn(allTimeRecords, "pointsFor", "allTimeRecords");
  };

  sortPastChampionsByYear = () => {
    const { pastChampions } = this.props;
    this.sortTableByColumn(pastChampions, "year", "pastChampions");
  };

  sortPastChampionsByWins = () => {
    const { pastChampions } = this.props;
    this.sortTableByColumn(pastChampions, "wins", "pastChampions");
  };

  sortPastChampionsByLosses = () => {
    const { pastChampions } = this.props;
    this.sortTableByColumn(pastChampions, "losses", "pastChampions");
  };

  sortPastChampionsByTies = () => {
    const { pastChampions } = this.props;
    this.sortTableByColumn(pastChampions, "ties", "pastChampions");
  };

  sortPastChampionsByWinPer = () => {
    const { pastChampions } = this.props;
    this.sortTableByColumn(pastChampions, "winPer", "pastChampions");
  };

  sortPastChampionsByPointsFor = () => {
    const { pastChampions } = this.props;
    this.sortTableByColumn(pastChampions, "pointsFor", "pastChampions");
  };

  sortBestH2HByYear = () => {
    const { bestH2H } = this.props;
    this.sortTableByColumn(bestH2H, "year", "bestH2H");
  };

  sortBestH2HByWins = () => {
    const { bestH2H } = this.props;
    this.sortTableByColumn(bestH2H, "wins", "bestH2H");
  };

  sortBestH2HByLosses = () => {
    const { bestH2H } = this.props;
    this.sortTableByColumn(bestH2H, "losses", "bestH2H");
  };

  sortBestH2HByTies = () => {
    const { bestH2H } = this.props;
    this.sortTableByColumn(bestH2H, "ties", "bestH2H");
  };

  sortBestH2HByWinPer = () => {
    const { bestH2H } = this.props;
    this.sortTableByColumn(bestH2H, "winPer", "bestH2H");
  };

  sortBestH2HByPointsFor = () => {
    const { bestH2H } = this.props;
    this.sortTableByColumn(bestH2H, "pointsFor", "bestH2H");
  };

  sortBestWeeksByPointsFor = () => {
    const { bestWeeks } = this.props;
    this.sortTableByColumn(bestWeeks, "pointsFor", "bestWeeks");
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

  render() {
    const {
      navigation,
      sport,
      allTimeRecords,
      pastChampions,
      bestH2H,
      bestWeeks,
    } = this.props;

    const emptyCheck =
      isEmptyArray(allTimeRecords) ||
      isEmptyArray(pastChampions) ||
      isEmptyArray(bestH2H) ||
      isEmptyArray(bestWeeks);

    if (emptyCheck) {
      return <LoadingIndicator />;
    }

    const title = `Trifecta Football Hall of Fame`;

    const headerRowHeight = 75;

    ///// All Time Records /////
    const allTimeRecordsHeaderRowMap = [
      { title: "Owner Names", onPress: this.noop },
      { title: "# of Seasons", onPress: this.sortAllTimeRecordsBySeasons },
      { title: "Wins", onPress: this.sortAllTimeRecordsByWins },
      { title: "Losses", onPress: this.sortAllTimeRecordsByLosses },
      { title: "Ties", onPress: this.sortAllTimeRecordsByTies },
      { title: "Win %", onPress: this.sortAllTimeRecordsByWinPer },
      {
        title: "Average Points For",
        onPress: this.sortAllTimeRecordsByPointsFor,
      },
    ];

    const allTimeRecordsHeaderRow = allTimeRecordsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    const allTimeRecordsTotalWidth = 650;
    const allTimeRecordsWidthArray = [200, 75, 75, 75, 75, 75, 75];
    const allTimeRecordsTotalHeight = allTimeRecords.length * 50;
    const allTimeRecordsObjectKeys = [
      "ownerNames",
      "seasons",
      "wins",
      "losses",
      "ties",
      "winPer",
      "pointsFor",
    ];

    ///// Past Champions /////
    const pastChampionsHeaderRowMap = [
      { title: "Year", onPress: this.sortPastChampionsByYear },
      { title: "Owner Names", onPress: this.noop },
      { title: "Team Name", onPress: this.noop },
      { title: "Wins", onPress: this.sortPastChampionsByWins },
      { title: "Losses", onPress: this.sortPastChampionsByLosses },
      { title: "Ties", onPress: this.sortPastChampionsByTies },
      { title: "Win %", onPress: this.sortPastChampionsByWinPer },
      {
        title: "Points For",
        onPress: this.sortPastChampionsByPointsFor,
      },
    ];
    const pastChampionsHeaderRow = pastChampionsHeaderRowMap.map(
      this.renderHeaderRowColumn
    );
    const pastChampionsObjectKeys = [
      "year",
      "ownerNames",
      "teamName",
      "wins",
      "losses",
      "ties",
      "winPer",
      "pointsFor",
    ];
    const pastChampionsWidthArray = [75, 250, 250, 75, 75, 75, 75, 75];
    const pastChampionsTotalWidth = sum(pastChampionsWidthArray);
    const pastChampionsTotalHeight = pastChampions.length * 50;

    ///// Best H2H /////
    const bestH2HHeaderRowMap = [
      { title: "Year", onPress: this.sortBestH2HByYear },
      { title: "Owner Names", onPress: this.noop },
      { title: "Team Name", onPress: this.noop },
      { title: "Wins", onPress: this.sortBestH2HByWins },
      { title: "Losses", onPress: this.sortBestH2HByLosses },
      { title: "Ties", onPress: this.sortBestH2HByTies },
      { title: "Win %", onPress: this.sortBestH2HByWinPer },
      {
        title: "Points For",
        onPress: this.sortBestH2HByPointsFor,
      },
    ];
    const bestH2HHeaderRow = bestH2HHeaderRowMap.map(
      this.renderHeaderRowColumn
    );

    const bestH2HObjectKeys = [
      "year",
      "ownerNames",
      "teamName",
      "wins",
      "losses",
      "ties",
      "winPer",
      "pointsFor",
    ];
    const bestH2HWidthArray = [75, 250, 250, 75, 75, 75, 75, 75];
    const bestH2HTotalWidth = sum(bestH2HWidthArray);
    const bestH2HTotalHeight = bestH2H.length * 50;

    ///// Best Weeks /////
    const bestWeeksHeaderRowMap = [
      { title: "Year", onPress: this.noop },
      { title: "Week", onPress: this.noop },
      { title: "Owner Names", onPress: this.noop },
      { title: "Team Name", onPress: this.noop },
      { title: "Points Scored", onPress: this.sortBestWeeksByPointsFor },
    ];
    const bestWeeksHeaderRow = bestWeeksHeaderRowMap.map(
      this.renderHeaderRowColumn
    );
    const bestWeeksObjectKeys = [
      "year",
      "week",
      "ownerNames",
      "teamName",
      "pointsFor",
    ];
    const bestWeeksWidthArray = [75, 75, 250, 250, 75];
    const bestWeeksTotalWidth = sum(bestWeeksWidthArray);
    const bestWeeksTotalHeight = bestWeeks.length * 50;

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.headerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.table}>
          <Text style={styles.subtext}>All-Time Records</Text>

          <Text style={styles.subtext}>
            Does not include 2018, which was not part of Trifecta cycle due to
            re-alignment
          </Text>
          <Row
            data={allTimeRecordsHeaderRow}
            height={headerRowHeight}
            totalwidth={allTimeRecordsTotalWidth}
            widthArray={allTimeRecordsWidthArray}
            rowStyle={styles.header}
            numberOfLines={2}
          />
          <Rows
            data={allTimeRecords}
            totalheight={allTimeRecordsTotalHeight}
            totalwidth={allTimeRecordsTotalWidth}
            widthArray={allTimeRecordsWidthArray}
            objectKeys={allTimeRecordsObjectKeys}
            numberOfLines={2}
          />
        </View>
        <View style={styles.table}>
          <Text style={styles.subtext}>Past Champions</Text>
          <Row
            data={pastChampionsHeaderRow}
            height={headerRowHeight}
            totalwidth={pastChampionsTotalWidth}
            widthArray={pastChampionsWidthArray}
            rowStyle={styles.header}
            numberOfLines={2}
          />
          <Rows
            data={pastChampions}
            totalheight={pastChampionsTotalHeight}
            totalwidth={pastChampionsTotalWidth}
            widthArray={pastChampionsWidthArray}
            objectKeys={pastChampionsObjectKeys}
            numberOfLines={2}
          />
        </View>
        <View style={styles.table}>
          <Text style={styles.subtext}>10+ Win H2H Seasons</Text>
          <Row
            data={bestH2HHeaderRow}
            height={headerRowHeight}
            totalwidth={bestH2HTotalWidth}
            widthArray={bestH2HWidthArray}
            rowStyle={styles.header}
            numberOfLines={2}
          />
          <Rows
            data={bestH2H}
            totalheight={bestH2HTotalHeight}
            totalwidth={bestH2HTotalWidth}
            widthArray={bestH2HWidthArray}
            objectKeys={bestH2HObjectKeys}
            numberOfLines={2}
          />
        </View>
        <View style={styles.table}>
          <Text style={styles.subtext}>Top 5 Highest Scoring Single Weeks</Text>
          <Text style={styles.subtext}>
            In 2017, scoring changed from standard to 0.5 PPR.{"\n"}In 2020,
            additional FLEX starting lineup spot added.{"\n"}Highest single week
            scores from previous scoring formats are also recorded below.
          </Text>
          <Row
            data={bestWeeksHeaderRow}
            height={headerRowHeight}
            totalwidth={bestWeeksTotalWidth}
            widthArray={bestWeeksWidthArray}
            rowStyle={styles.header}
            numberOfLines={2}
          />
          <Rows
            data={bestWeeks}
            totalheight={bestWeeksTotalHeight}
            totalwidth={bestWeeksTotalWidth}
            widthArray={bestWeeksWidthArray}
            objectKeys={bestWeeksObjectKeys}
            numberOfLines={2}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    getSport,
    getAllTimeRecords,
    getPastChampions,
    getBestH2H,
    getBestWeeks,
  } = getFootballHallOfFameStateSelectors(state);

  return {
    sport: getSport(),
    allTimeRecords: getAllTimeRecords(),
    pastChampions: getPastChampions(),
    bestH2H: getBestH2H(),
    bestWeeks: getBestWeeks(),
  };
};

const mapDispatchToProps = {
  displayHallOfFame,
  sortFootballTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(HallOfFameFootball);
