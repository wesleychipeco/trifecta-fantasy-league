import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { Navbar } from "../components/Navbar";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { StandingsDropdownPre2019 } from "../components/StandingsDropdownPre2019";
import { StandingsDropdownPost2019 } from "../components/StandingsDropdownPost2019";
import { getBasketballStandingsStateSelectors } from "../store/basketballStandings/basketballStandingsReducer";
import {
  scrapeBasketballStandings,
  displayBasketballStandings,
  sortTable
} from "../store/basketballStandings/basketballStandingsActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/basketballStandings";
import { sortArrayBy, isYear1BeforeYear2, isEmptyArray } from "../utils";
import { LinkText } from "../components/LinkText";
import { returnMongoCollection } from "../databaseManagement";
import { standingsStyles as styles } from "../styles/globalStyles";

class BasketballStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: null,
      currentYear: null,
      seasonStarted: null,
      inSeason: null,
      basketballAhead: null,
      trifectaStandings: {
        sortedColumn: null,
        highToLow: null
      },
      h2hStandings: {
        sortedColumn: "h2hTrifectaPoints",
        highToLow: true
      },
      rotoStandings: {
        sortedColumn: "rotoTrifectaPoints",
        highToLow: true
      },
      rotoStats: {
        sortedColumn: "teamName",
        highToLow: true
      },
      basketballStandings: {
        sortedColumn: null,
        highToLow: null
      }
    };
  }

  componentDidMount() {
    this.retrieveData();
  }

  componentDidUpdate(prevProps, prevState) {
    const year = this.props.navigation.getParam("year", "No year was defined!");
    this.setState({
      year
    });

    if (prevState.year !== this.state.year) {
      this.retrieveData();
    }
  }

  retrieveData = () => {
    const { lastScraped, navigation } = this.props;
    const year = navigation.getParam("year");

    const seasonVariablesCollection = returnMongoCollection("seasonVariables");
    seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then(seasonVariables => {
        const { currentYear, basketballAhead } = seasonVariables[0];
        const { seasonStarted, inSeason } = seasonVariables[0].basketball;
        const {
          scrapeBasketballStandings,
          displayBasketballStandings
        } = this.props;

        if (isYear1BeforeYear2(year, currentYear)) {
          displayBasketballStandings(year);
        } else {
          const defaultSortColumn =
            inSeason || (basketballAhead && year !== currentYear)
              ? "trifectaPoints"
              : "totalTrifectaPoints";

          this.setState({
            currentYear,
            seasonStarted,
            inSeason,
            basketballAhead,
            trifectaStandings: {
              sortedColumn: defaultSortColumn,
              highToLow: true
            }
          });

          // if IN basketball ahead season
          if (basketballAhead && year !== currentYear) {
            scrapeBasketballStandings(year);
          }
          // if NOT in the basketball ahead season
          else {
            if (seasonStarted) {
              if (inSeason && !lastScraped) {
                scrapeBasketballStandings(year);
              } else {
                displayBasketballStandings(year, defaultSortColumn);
              }
            }
          }
        }
      });
  };

  sortTableByColumn = (
    tableArray,
    columnKey,
    tableType = "basketballStandings"
  ) => {
    const { sortTable } = this.props;
    const { sortedColumn, highToLow } = this.state[tableType];

    const tableArraySorted = [...tableArray];

    if (sortedColumn === columnKey) {
      this.setState({
        [tableType]: {
          sortedColumn: columnKey,
          highToLow: !highToLow
        }
      });
      sortTable([
        sortArrayBy(tableArraySorted, columnKey, !highToLow),
        tableType
      ]);
    } else {
      const columnDefaultSortDirection =
        tableDefaultSortDirections[tableType][columnKey];
      this.setState({
        [tableType]: {
          sortedColumn: columnKey,
          highToLow: columnDefaultSortDirection
        }
      });
      sortTable([
        sortArrayBy(tableArraySorted, columnKey, columnDefaultSortDirection),
        tableType
      ]);
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
  sortRotoStandingsByFGPERPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "FGPERPoints", "rotoStandings");
  };

  sortRotoStandingsByFTPERPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "FTPERPoints", "rotoStandings");
  };

  sortRotoStandingsByTHREEPMPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "THREEPMPoints", "rotoStandings");
  };

  sortRotoStandingsByREBPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "REBPoints", "rotoStandings");
  };

  sortRotoStandingsByASTPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "ASTPoints", "rotoStandings");
  };

  sortRotoStandingsBySTLPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "STLPoints", "rotoStandings");
  };

  sortRotoStandingsByBLKPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "BLKPoints", "rotoStandings");
  };

  sortRotoStandingsByTOPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "TOPoints", "rotoStandings");
  };

  sortRotoStandingsByPTSPoints = () => {
    const { rotoStandings } = this.props;
    this.sortTableByColumn(rotoStandings, "PTSPoints", "rotoStandings");
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

  // Roto Stats table sort methods
  sortRotoStatsByFGPER = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "FGPER", "rotoStats");
  };

  sortRotoStatsByFTPER = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "FTPER", "rotoStats");
  };

  sortRotoStatsByTHREEPM = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "THREEPM", "rotoStats");
  };

  sortRotoStatsByREB = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "REB", "rotoStats");
  };

  sortRotoStatsByAST = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "AST", "rotoStats");
  };

  sortRotoStatsBySTL = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "STL", "rotoStats");
  };

  sortRotoStatsByBLK = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "BLK", "rotoStats");
  };

  sortRotoStatsByTO = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "TO", "rotoStats");
  };

  sortRotoStatsByPTS = () => {
    const { rotoStats } = this.props;
    this.sortTableByColumn(rotoStats, "PTS", "rotoStats");
  };

  // OLD - Basketball standings table sort methods
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
        textStyles={styles.headerText}
      />
    );
  };

  renderStandingsDropdown = () => {
    const { navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    if (isYear1BeforeYear2(year, "2019")) {
      const year1 = (Number(year) - 1).toString();
      return (
        <StandingsDropdownPre2019
          navigation={navigation}
          year1={year1}
          year2={year.toString()}
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
      rotoStandings,
      rotoStats,
      basketballStandings
    } = this.props;
    const { seasonStarted, inSeason, basketballAhead } = this.state;
    const year = navigation.getParam("year", "No year was defined!");

    if (seasonStarted === false) {
      return (
        <View>
          <Text>Not in season yet!</Text>
        </View>
      );
    }

    const isAfter2020 = !isYear1BeforeYear2(year, "2020");

    const standingsConditional = isAfter2020
      ? isEmptyArray(h2hStandings) ||
        isEmptyArray(rotoStandings) ||
        isEmptyArray(rotoStats) ||
        isEmptyArray(trifectaStandings)
      : isEmptyArray(basketballStandings);

    if (standingsConditional) {
      return <LoadingIndicator />;
    }

    if (isAfter2020) {
      ///// Trifecta Standings /////
      const trifectaStandingsHeaderRowHeight = 75;
      const trifectaStandingsTotalHeight = 500;
      const trifectaStandingsTotalWidth =
        inSeason || basketballAhead ? 700 : 900;
      const trifectaStandingsWidthArray = [200, 200, 100, 100, 100];
      const trifectaStandingsObjectKeys = [
        "teamName",
        "ownerNames",
        "h2hTrifectaPoints",
        "rotoTrifectaPoints",
        "trifectaPoints"
      ];

      // Create header row for Trifecta Standings Table
      const trifectaStandingsHeaderRowMap = [
        { title: "Team Name", onPress: this.noop },
        { title: "Owner(s)", onPress: this.noop },
        {
          title: "H2H Trifecta Points",
          onPress: this.sortTrifectaStandingsByH2HPoints
        },
        {
          title: "Roto Trifecta Points",
          onPress: this.sortTrifectaStandingsByRotoPoints
        },
        {
          title: "Regular Season Trifecta Points",
          onPress: this.sortTrifectaStandingsByTrifectaPoints
        }
      ];

      if (!inSeason && !basketballAhead) {
        trifectaStandingsWidthArray.push(100, 100);
        trifectaStandingsObjectKeys.push(
          "playoffPoints",
          "totalTrifectaPoints"
        );
        trifectaStandingsHeaderRowMap.push(
          {
            title: "Playoff Points",
            onPress: this.sortTrifectaStandingsByPlayoffPoints
          },
          {
            title: "Total Trifecta Points",
            onPress: this.sortTrifectaStandingsByTotalTrifectaPoints
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
        "h2hTrifectaPoints"
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
          onPress: this.sortH2HStandingsByTrifectaPoints
        }
      ];
      const h2hStandingsHeaderRow = h2hStandingsHeaderRowMap.map(
        this.renderHeaderRowColumn
      );

      ///// ROTO STANDINGS /////
      const rotoStandingsHeaderRowHeight = 75;
      const rotoStandingsTotalHeight = 500;
      const rotoStandingsTotalWidth = 1025;
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
        75
      ];
      const rotoStandingsObjectKeys = [
        "teamName",
        "FGPERPoints",
        "FTPERPoints",
        "THREEPMPoints",
        "REBPoints",
        "ASTPoints",
        "STLPoints",
        "BLKPoints",
        "TOPoints",
        "PTSPoints",
        "totalPoints",
        "rotoTrifectaPoints"
      ];
      // Create header row for Roto Standings Table
      const rotoStandingsHeaderRowMap = [
        { title: "Team Name", onPress: this.noop },
        { title: "FG %", onPress: this.sortRotoStandingsByFGPERPoints },
        { title: "FT %", onPress: this.sortRotoStandingsByFTPERPoints },
        { title: "3PM", onPress: this.sortRotoStandingsByTHREEPMPoints },
        { title: "REB", onPress: this.sortRotoStandingsByREBPoints },
        { title: "AST", onPress: this.sortRotoStandingsByASTPoints },
        { title: "STL", onPress: this.sortRotoStandingsBySTLPoints },
        { title: "BLK", onPress: this.sortRotoStandingsByBLKPoints },
        { title: "TO", onPress: this.sortRotoStandingsByTOPoints },
        { title: "PTS", onPress: this.sortRotoStandingsByPTSPoints },
        { title: "Roto Points", onPress: this.sortRotoStandingsByRotoPoints },
        {
          title: "Roto Trifecta Points",
          onPress: this.sortRotoStandingsByTrifectaPoints
        }
      ];
      const rotoStandingsHeaderRow = rotoStandingsHeaderRowMap.map(
        this.renderHeaderRowColumn
      );

      ///// ROTO STATS /////
      const rotoStatsHeaderRowHeight = 75;
      const rotoStatsTotalHeight = 500;
      const rotoStatsTotalWidth = 875;
      const rotoStatsWidthArray = [200, 75, 75, 75, 75, 75, 75, 75, 75, 75];
      const rotoStatsObjectKeys = [
        "teamName",
        "FGPER",
        "FTPER",
        "THREEPM",
        "REB",
        "AST",
        "STL",
        "BLK",
        "TO",
        "PTS"
      ];
      const rotoStatsHeaderRowMap = [
        { title: "Team Name", onPress: this.noop },
        { title: "FG %", onPress: this.sortRotoStatsByFGPER },
        { title: "FT %", onPress: this.sortRotoStatsByFTPER },
        { title: "3PM", onPress: this.sortRotoStatsByTHREEPM },
        { title: "REB", onPress: this.sortRotoStatsByREB },
        { title: "AST", onPress: this.sortRotoStatsByAST },
        { title: "STL", onPress: this.sortRotoStatsBySTL },
        { title: "BLK", onPress: this.sortRotoStatsByBLK },
        { title: "TO", onPress: this.sortRotoStatsByTO },
        { title: "PTS", onPress: this.sortRotoStatsByPTS }
      ];
      const rotoStatsHeaderRow = rotoStatsHeaderRowMap.map(
        this.renderHeaderRowColumn
      );
      const title = `${year} Basketball Standings!`;

      return (
        <View style={styles.container}>
          <Navbar navigation={navigation} />
          <View style={styles.headerSection}>
            <Text style={styles.title}>{title}</Text>
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
              />
            </View>
            <View style={styles.table}>
              <Text style={styles.subtext}>H2H Standings</Text>
              <Row
                data={h2hStandingsHeaderRow}
                height={h2hStandingsHeaderRowHeight}
                totalwidth={h2hStandingsTotalWidth}
                widthArray={h2hStandingsWidthArray}
                rowStyle={styles.header}
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
            <View style={styles.table}>
              <Text style={styles.subtext}>Roto Standings</Text>
              <Row
                data={rotoStandingsHeaderRow}
                height={rotoStandingsHeaderRowHeight}
                totalwidth={rotoStandingsTotalWidth}
                widthArray={rotoStandingsWidthArray}
                rowStyle={styles.header}
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
              <View style={styles.table}>
                <Text style={styles.subtext}>Roto Stats</Text>
                <Row
                  data={rotoStatsHeaderRow}
                  height={rotoStatsHeaderRowHeight}
                  totalwidth={rotoStatsTotalWidth}
                  widthArray={rotoStatsWidthArray}
                  rowStyle={styles.header}
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
          </View>
        </View>
      );
    } else {
      const headerRowHeight = 75;
      const totalHeight = 500;
      const totalWidth = inSeason ? 900 : 1100;
      const widthArray = [200, 200, 100, 100, 100, 100, 100, 100, 100];
      const objectKeys = [
        "teamName",
        "ownerNames",
        "wins",
        "losses",
        "ties",
        "winPer",
        "trifectaPoints",
        "playoffPoints",
        "totalTrifectaPoints"
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
          onPress: this.sortBasketballStandingsByTrifectaPoints
        },
        {
          title: "Playoff Points",
          onPress: this.sortBasketballStandingsByPlayoffPoints
        },
        {
          title: "Total Trifecta Points",
          onPress: this.sortBasketballStandingsByTotalTrifectaPoints
        }
      ];
      const headerRow = headerRowMap.map(this.renderHeaderRowColumn);
      const title = `${year} Basketball Standings!`;

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
            <Row
              data={headerRow}
              height={headerRowHeight}
              totalWidth={totalWidth}
              widthArray={widthArray}
              rowStyle={styles.header}
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
}

const mapStateToProps = state => {
  const {
    getTrifectaStandings,
    getH2HStandings,
    getRotoStandings,
    getRotoStats,
    getBasketballStandings,
    getLastScraped
  } = getBasketballStandingsStateSelectors(state);

  return {
    trifectaStandings: getTrifectaStandings(),
    h2hStandings: getH2HStandings(),
    rotoStandings: getRotoStandings(),
    rotoStats: getRotoStats(),
    basketballStandings: getBasketballStandings(),
    lastScraped: getLastScraped()
  };
};

const mapDispatchToProps = {
  scrapeBasketballStandings,
  displayBasketballStandings,
  sortTable
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasketballStandings);
