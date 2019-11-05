import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { LinkText } from "../components/LinkText";
import { Navbar } from "../components/Navbar";
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
import { sortArrayBy, isYear1BeforeYear2 } from "../utils";
import { standingsStyles as styles } from "../styles/globalStyles";

class FootballStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: null,
      currentYear: null,
      seasonStarted: null,
      inSeason: null,
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
      .then(seasonVariables => {
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
  };

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
        <View style={styles.headerSection}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.dropdown}>{this.renderStandingsDropdown()}</View>
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
          />
        </View>
      </View>
    );
  }
}

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
