import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { LinkText } from "../components/LinkText";
import { Navbar } from "../components/Navbar";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { StandingsDropdownPre2019 } from "../components/StandingsDropdownPre2019";
import { StandingsDropdownPost2019 } from "../components/StandingsDropdownPost2019";
import { getFootballStandingsStateSelectors } from "../store/footballStandings/footballStandingsReducer";
import {
  scrapeFootballStandings,
  displayFootballStandings,
  sortTable,
} from "../store/footballStandings/footballStandingsActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/footballStandings";
import { returnMongoCollection } from "../databaseManagement";
import { sortArrayBy, isYear1BeforeYear2, isEmptyArray } from "../utils";
import { standingsStyles as styles } from "../styles/globalStyles";

class FootballStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: null,
      currentYear: null,
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
      top5Bottom5Standings: {
        sortedColumn: "top5Bottom5TrifectaPoints",
        highToLow: true,
      },
      footballStandings: {
        sortedColumn: null,
        highToLow: null,
      },
    };
  }

  componentDidMount() {
    this.retrieveData();
  }

  componentDidUpdate(prevProps, prevState) {
    const year = this.props.navigation.getParam("year", "No year was defined!");
    this.setState({
      year,
    });

    if (prevState.year !== this.state.year) {
      this.retrieveData();
    }
  }

  retrieveData = () => {
    const { lastScraped, navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    const seasonVariablesCollection = returnMongoCollection("seasonVariables");
    seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then((seasonVariables) => {
        const { currentYear } = seasonVariables[0];
        const { seasonStarted, inSeason } = seasonVariables[0].football;
        const {
          scrapeFootballStandings,
          displayFootballStandings,
        } = this.props;

        if (isYear1BeforeYear2(year, currentYear)) {
          displayFootballStandings(year);
        } else {
          const defaultSortColumn = inSeason
            ? "trifectaPoints"
            : "totalTrifectaPoints";

          this.setState({
            currentYear,
            seasonStarted,
            inSeason,
            trifectaStandings: {
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
  };

  sortTableByColumn = (
    tableArray,
    columnKey,
    tableType = "footballStandings"
  ) => {
    const { sortTable } = this.props;
    const { sortedColumn, highToLow } = this.state[tableType];

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

  // Trifecta Standings Table sort methods
  sortTrifectaStandingsByH2HPoints = () => {
    const { trifectaStandings } = this.props;
    this.sortTableByColumn(
      trifectaStandings,
      "h2hTrifectaPoints",
      "trifectaStandings"
    );
  };

  sortTrifectaStandingsByTop5Bottom5TrifectaPoints = () => {
    const { trifectaStandings } = this.props;
    this.sortTableByColumn(
      trifectaStandings,
      "top5Bottom5TrifectaPoints",
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

  // H2H Standings table sort methods
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

  // Top5 Bottom5 standings table sort methods
  sortTop5Bottom5StandingsByWins = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "wins");
  };

  sortTop5Bottom5StandingsByLosses = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "losses");
  };

  sortTop5Bottom5StandingsByWinPer = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "winPer");
  };

  sortTop5Bottom5StandingsByTrifectaPoints = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "top5Bottom5TrifectaPoints");
  };

  sortTop5Bottom5StandingsByWeek1 = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "week1");
  };

  sortTop5Bottom5StandingsByWeek2 = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "week2");
  };

  sortTop5Bottom5StandingsByWeek3 = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "week3");
  };

  sortTop5Bottom5StandingsByWeek4 = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "week4");
  };

  sortTop5Bottom5StandingsByWeek5 = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "week5");
  };

  sortTop5Bottom5StandingsByWeek6 = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "week6");
  };

  sortTop5Bottom5StandingsByWeek7 = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "week7");
  };

  sortTop5Bottom5StandingsByWeek8 = () => {
    const { top5Bottom5Standings } = this.props;
    this.sortTableByColumn(top5Bottom5Standings, "week8");
  };

  // OLD - Football standings table sort methods
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
        textStyles={styles.headerText}
      />
    );
  };

  shouldRenderSubtext = () => {
    const { navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    const subtext =
      "Due to sport re-arrangement in the Trifecta cycle, 2018 Football is not part of any Trifecta season and for variety, was an auction draft";

    if (Number(year) === 2018) {
      return <Text style={styles.subtext}>{subtext}</Text>;
    }
    return null;
  };

  renderStandingsDropdown = () => {
    const { navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    if (isYear1BeforeYear2(year, "2019")) {
      const year2 = (Number(year) + 1).toString();
      return (
        <StandingsDropdownPre2019
          navigation={navigation}
          year1={year.toString()}
          year2={year2}
        />
      );
    }

    return (
      <StandingsDropdownPost2019
        navigation={navigation}
        year={year}
        currentYear={this.state.currentYear}
      />
    );
  };

  render() {
    const {
      navigation,
      trifectaStandings,
      h2hStandings,
      top5Bottom5Standings,
      footballStandings,
    } = this.props;
    const { seasonStarted, inSeason } = this.state;
    const year = navigation.getParam("year", "No year was defined!");
    const title = `${year} Football Standings!`;

    if (seasonStarted === false) {
      return (
        <View>
          <Text>Not in season yet!</Text>
        </View>
      );
    }

    const isAfter2019 = !isYear1BeforeYear2(year, "2020");
    const standingsLoadingConditional = isAfter2019
      ? isEmptyArray(h2hStandings) ||
        isEmptyArray(top5Bottom5Standings) ||
        isEmptyArray(trifectaStandings)
      : isEmptyArray(footballStandings);

    if (standingsLoadingConditional) {
      return <LoadingIndicator />;
    }

    if (isAfter2019) {
      ///// Trifecta Standings //////
      const trifectaStandingsHeaderRowHeight = 75;
      const trifectaStandingsTotalHeight = 500;
      const trifectaStandingsTotalWidth = inSeason ? 700 : 900;
      const trifectaStandingsWidthArray = [200, 200, 100, 100, 100];
      const trifectaStandingsObjectKeys = [
        "teamName",
        "ownerNames",
        "h2hTrifectaPoints",
        "top5Bottom5TrifectaPoints",
        "trifectaPoints",
      ];

      // Create header row for Trifecta Standings Table
      const trifectaStandingsHeaderRowMap = [
        { title: "Team Name", onPress: this.noop },
        { title: "Owner(s)", onPress: this.noop },
        {
          title: "H2H Trifecta Points",
          onPress: this.sortTrifectaStandingsByH2HPoints,
        },
        {
          title: "T5 B5 Trifecta Points",
          onPress: this.sortTrifectaStandingsByTop5Bottom5TrifectaPoints,
        },
        {
          title: "Regular Season Trifecta Points",
          onPress: this.sortTrifectaStandingsByTrifectaPoints,
        },
      ];

      if (!inSeason) {
        trifectaStandingsWidthArray.push(100, 100);
        trifectaStandingsObjectKeys.push(
          "playoffPoints",
          "totalTrifectaPoints"
        );
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

      ///// Top 5 Bottom 5 Standings //////
      const numberOfPermanentTop5Bottom5Columns = 5;
      const numberOfTotalColumns = Object.keys(top5Bottom5Standings[0]).length;
      const numberOfNeededWeekNumberColumns =
        numberOfTotalColumns - numberOfPermanentTop5Bottom5Columns;

      const top5Bottom5StandingsHeaderRowHeight = 75;
      const top5Bottom5StandingsTotalHeight = 500;
      const top5Bottom5StandingsTotalWidth =
        500 + numberOfNeededWeekNumberColumns * 75;
      const top5Bottom5StandingsWidthArray = [200, 75, 75, 75, 75];
      const top5Bottom5StandingsObjectKeys = ["teamName"];

      // Create header row for Top5 Bottom5 Standings table
      const top5Bottom5StandingsHeaderRowMap = [
        { title: "Team Name", onPress: this.noop },
      ];

      const sortByWeekObject = {
        week1: this.sortTop5Bottom5StandingsByWeek1,
        week2: this.sortTop5Bottom5StandingsByWeek2,
        week3: this.sortTop5Bottom5StandingsByWeek3,
      };

      for (let i = 1; i <= numberOfNeededWeekNumberColumns; i++) {
        top5Bottom5StandingsWidthArray.push(75);
        top5Bottom5StandingsObjectKeys.push(`week${i}`);
        top5Bottom5StandingsHeaderRowMap.push({
          title: `Week ${i}`,
          onPress: sortByWeekObject[`week${i}`],
        });
      }
      top5Bottom5StandingsObjectKeys.push(
        "wins",
        "losses",
        "winPer",
        "top5Bottom5TrifectaPoints"
      );
      top5Bottom5StandingsHeaderRowMap.push(
        { title: "Wins", onPress: this.sortTop5Bottom5StandingsByWins },
        { title: "Losses", onPress: this.sortTop5Bottom5StandingsByLosses },
        { title: "Win %", onPress: this.sortTop5Bottom5StandingsByWinPer },
        {
          title: "T5 B5 Trifecta Points",
          onPress: this.sortTop5Bottom5StandingsByTrifectaPoints,
        }
      );

      const top5Bottom5StandingsHeaderRow = top5Bottom5StandingsHeaderRowMap.map(
        this.renderHeaderRowColumn
      );

      return (
        <View style={styles.container}>
          <Navbar navigation={navigation} />
          <View style={styles.headerSection}>
            <Text style={styles.title}>{title}</Text>
            {this.shouldRenderSubtext()}
            <View style={styles.dropdown}>
              {this.renderStandingsDropdown()}
            </View>
          </View>
          <View style={styles.tables}>
            <View style={styles.table}>
              <Text style={styles.subtext}>Trifecta Standings</Text>
              <Row
                data={trifectaStandingsHeaderRow}
                height={trifectaStandingsHeaderRowHeight}
                totalWidth={trifectaStandingsTotalWidth}
                widthArray={trifectaStandingsWidthArray}
                rowStyle={styles.header}
              />
              <Rows
                data={trifectaStandings}
                totalheight={trifectaStandingsTotalHeight}
                totalwidth={trifectaStandingsTotalWidth}
                widthArray={trifectaStandingsWidthArray}
                objectKeys={trifectaStandingsObjectKeys}
                top3Styling
              />
            </View>
            <View style={styles.table}>
              <Text style={styles.subtext}>H2H Standings</Text>
              <Row
                data={h2hStandingsHeaderRow}
                height={h2hStandingsHeaderRowHeight}
                totalWidth={h2hStandingsTotalWidth}
                widthArray={h2hStandingsWidthArray}
                rowStyle={styles.header}
              />
              <Rows
                data={h2hStandings}
                totalheight={h2hStandingsTotalHeight}
                totalwidth={h2hStandingsTotalWidth}
                widthArray={h2hStandingsWidthArray}
                objectKeys={h2hStandingsObjectKeys}
              />
            </View>
            <View style={styles.table}>
              <Text style={styles.subtext}>Top5 Bottom5 Standings</Text>
              <Row
                data={top5Bottom5StandingsHeaderRow}
                height={top5Bottom5StandingsHeaderRowHeight}
                totalWidth={top5Bottom5StandingsTotalWidth}
                widthArray={top5Bottom5StandingsWidthArray}
                rowStyle={styles.header}
              />
              <Rows
                data={top5Bottom5Standings}
                totalheight={top5Bottom5StandingsTotalHeight}
                totalwidth={top5Bottom5StandingsTotalWidth}
                widthArray={top5Bottom5StandingsWidthArray}
                objectKeys={top5Bottom5StandingsObjectKeys}
              />
            </View>
          </View>
        </View>
      );
    } else {
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

      return (
        <View style={styles.container}>
          <Navbar navigation={navigation} />
          <View style={styles.headerSection}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.dropdown}>
              {this.renderStandingsDropdown()}
            </View>
          </View>
          <View style={styles.table}>
            {this.shouldRenderSubtext()}
            <Row
              data={headerRow}
              height={headerRowHeight}
              totalWidth={totalWidth}
              widthArray={widthArray}
              rowStyle={styles.header}
            />
            <Rows
              data={footballStandings}
              totalheight={totalHeight}
              totalwidth={totalWidth}
              widthArray={widthArray}
              objectKeys={objectKeys}
              top3Styling
            />
          </View>
        </View>
      );
    }
  }
}

const mapStateToProps = (state) => {
  const {
    getTrifectaStandings,
    getH2HStandings,
    getTop5Bottom5Standings,
    getFootballStandings,
    getLastScraped,
  } = getFootballStandingsStateSelectors(state);

  return {
    trifectaStandings: getTrifectaStandings(),
    h2hStandings: getH2HStandings(),
    top5Bottom5Standings: getTop5Bottom5Standings(),
    footballStandings: getFootballStandings(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  scrapeFootballStandings,
  displayFootballStandings,
  sortTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(FootballStandings);
