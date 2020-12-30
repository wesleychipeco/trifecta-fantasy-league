import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { Navbar } from "../components/Navbar";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { getBaseballHallOfFameStateSelectors } from "../store/hallOfFame/baseballHallOfFameReducer";
import {
  displayHallOfFame,
  sortBaseballTable,
} from "../store/hallOfFame/hallOfFameActions";
import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/hallOfFame/baseball";
import { standingsStyles as styles } from "../styles/globalStyles";
import { isEmptyArray, sum, sortArrayBy } from "../utils";
import { LinkText } from "../components/LinkText";

export class HallOfFameBaseball extends PureComponent {
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
      bestRoto: {
        sortedColumn: "rotoPoints",
        highToLow: true,
      },
    };
  }

  componentDidMount() {
    this.props.displayHallOfFame("baseball");
  }

  noop = () => {};

  sortTableByColumn = (tableArray, columnKey, tableType) => {
    const { sortBaseballTable } = this.props;
    const { sortedColumn, highToLow } = this.state[tableType];
    const tableArraySorted = [...tableArray];

    if (sortedColumn === columnKey) {
      this.setState({
        [tableType]: {
          sortedColumn: columnKey,
          highToLow: !highToLow,
        },
      });
      sortBaseballTable([
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
      sortBaseballTable([
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

  sortAllTimeRecordsByRotoPoints = () => {
    const { allTimeRecords } = this.props;
    this.sortTableByColumn(allTimeRecords, "rotoPoints", "allTimeRecords");
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

  sortPastChampionsByRotoPoints = () => {
    const { pastChampions } = this.props;
    this.sortTableByColumn(pastChampions, "rotoPoints", "pastChampions");
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

  sortBestRotoByYear = () => {
    const { bestRoto } = this.props;
    this.sortTableByColumn(bestRoto, "year", "bestRoto");
  };

  sortBestRotoByRotoPoints = () => {
    const { bestRoto } = this.props;
    this.sortTableByColumn(bestRoto, "rotoPoints", "bestRoto");
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
      allTimeRecords,
      pastChampions,
      bestH2H,
      bestRoto,
    } = this.props;

    const emptyCheck =
      isEmptyArray(allTimeRecords) ||
      isEmptyArray(pastChampions) ||
      isEmptyArray(bestH2H) ||
      isEmptyArray(bestRoto);

    if (emptyCheck) {
      return <LoadingIndicator />;
    }

    const title = `Trifecta Baseball Hall of Fame`;

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
        title: "Average Roto Points",
        onPress: this.sortAllTimeRecordsByRotoPoints,
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
      "rotoPoints",
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
        title: "Roto Points",
        onPress: this.sortPastChampionsByRotoPoints,
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
      "rotoPoints",
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
    ];
    const bestH2HWidthArray = [75, 250, 250, 75, 75, 75, 75];
    const bestH2HTotalWidth = sum(bestH2HWidthArray);
    const bestH2HTotalHeight = bestH2H.length * 50;

    ///// Best Roto /////
    const bestRotoHeaderRowMap = [
      { title: "Year", onPress: this.sortBestRotoByYear },
      { title: "Owner Names", onPress: this.noop },
      { title: "Team Name", onPress: this.noop },
      { title: "Average Roto Points", onPress: this.sortBestRotoByWinPer },
    ];
    const bestRotoHeaderRow = bestRotoHeaderRowMap.map(
      this.renderHeaderRowColumn
    );
    const bestRotoObjectKeys = ["year", "ownerNames", "teamName", "rotoPoints"];
    const bestRotoWidthArray = [75, 250, 250, 75];
    const bestRotoTotalWidth = sum(bestRotoWidthArray);
    const bestRotoTotalHeight = bestRoto.length * 50;

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.headerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.table}>
          <Text style={styles.subtext}>All-Time Records</Text>
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
          <Text style={styles.subtext}>Top 5 H2H Seasons</Text>
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
          <Text style={styles.subtext}>Top 5 Roto Seasons</Text>
          <Row
            data={bestRotoHeaderRow}
            height={headerRowHeight}
            totalwidth={bestRotoTotalWidth}
            widthArray={bestRotoWidthArray}
            rowStyle={styles.header}
            numberOfLines={2}
          />
          <Rows
            data={bestRoto}
            totalheight={bestRotoTotalHeight}
            totalwidth={bestRotoTotalWidth}
            widthArray={bestRotoWidthArray}
            objectKeys={bestRotoObjectKeys}
            numberOfLines={2}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    getAllTimeRecords,
    getPastChampions,
    getBestH2H,
    getBestRoto,
  } = getBaseballHallOfFameStateSelectors(state);

  return {
    allTimeRecords: getAllTimeRecords(),
    pastChampions: getPastChampions(),
    bestH2H: getBestH2H(),
    bestRoto: getBestRoto(),
  };
};

const mapDispatchToProps = {
  displayHallOfFame,
  sortBaseballTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(HallOfFameBaseball);
