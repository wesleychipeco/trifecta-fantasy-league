import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { Navbar } from "../components/Navbar";
import { LinkText } from "../components/LinkText";
import { StandingsDropdownPre2019 } from "../components/StandingsDropdownPre2019";
import { StandingsDropdownPost2019 } from "../components/StandingsDropdownPost2019";
import { getTrifectaStandingsStateSelectors } from "../store/trifectaStandings/trifectaStandingsReducer";
import {
  calculateTrifectaStandings,
  displayTrifectaStandings,
  sortTable,
} from "../store/trifectaStandings/trifectaStandingsActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/trifectaStandings";
import { sortArrayBy, isYear1BeforeYear2 } from "../utils";
import { returnMongoCollection } from "../databaseManagement";
import { standingsStyles as styles } from "../styles/globalStyles";

class TrifectaStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: null,
      currentYear: null,
      basketballSeasonEnded: null,
      baseballSeasonEnded: null,
      footballSeasonEnded: null,
      trifectaStandings: {
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
    const {
      lastScraped,
      navigation,
      calculateTrifectaStandings,
      displayTrifectaStandings,
    } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    const seasonVariablesCollection = returnMongoCollection("seasonVariables");
    seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then(seasonVariables => {
        const { currentYear } = seasonVariables[0];
        this.setState({
          year,
          currentYear,
          trifectaStandings: {
            sortedColumn: "totalTrifectaPoints",
            highToLow: true,
          },
        });

        if (isYear1BeforeYear2(year, currentYear) || lastScraped) {
          displayTrifectaStandings(year);
        } else {
          const basketballSeasonVariables = seasonVariables[0].basketball;
          const basketballSeasonEnded = this.isSeasonEnded(
            basketballSeasonVariables
          );

          const baseballSeasonVariables = seasonVariables[0].baseball;
          const baseballSeasonEnded = this.isSeasonEnded(
            baseballSeasonVariables
          );

          const footballSeasonVariables = seasonVariables[0].football;
          const footballSeasonEnded = this.isSeasonEnded(
            footballSeasonVariables
          );

          this.setState({
            basketballSeasonEnded,
            baseballSeasonEnded,
            footballSeasonEnded,
          });

          calculateTrifectaStandings(
            year,
            basketballSeasonEnded,
            baseballSeasonEnded,
            footballSeasonEnded
          );
        }
      });
  };

  isSeasonEnded = seasonVariables => {
    const { seasonStarted, inSeason } = seasonVariables;
    return seasonStarted === true && inSeason === false ? true : false;
  };

  sortTableByColumn = (tableArray, columnKey) => {
    const { sortTable } = this.props;
    const { sortedColumn, highToLow } = this.state.trifectaStandings;

    const tableArraySorted = [...tableArray];

    if (sortedColumn === columnKey) {
      this.setState({
        trifectaStandings: {
          sortedColumn: columnKey,
          highToLow: !highToLow,
        },
      });
      sortTable(sortArrayBy(tableArraySorted, columnKey, !highToLow));
    } else {
      const columnDefaultSortDirection =
        tableDefaultSortDirections.trifectaStandings[columnKey];
      this.setState({
        trifectaStandings: {
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

  sortTrifectaStandingsByBasketball = () => {
    const { trifectaStandings } = this.props;
    const { basketballSeasonEnded, year, currentYear } = this.state;
    if (basketballSeasonEnded || isYear1BeforeYear2(year, currentYear)) {
      this.sortTableByColumn(trifectaStandings, "basketballTrifectaPoints");
    }
  };

  sortTrifectaStandingsByBaseball = () => {
    const { trifectaStandings } = this.props;
    const { baseballSeasonEnded, year, currentYear } = this.state;
    if (baseballSeasonEnded || isYear1BeforeYear2(year, currentYear)) {
      this.sortTableByColumn(trifectaStandings, "baseballTrifectaPoints");
    }
  };

  sortTrifectaStandingsByFootball = () => {
    const { trifectaStandings } = this.props;
    const { footballSeasonEnded, year, currentYear } = this.state;
    if (footballSeasonEnded || isYear1BeforeYear2(year, currentYear)) {
      this.sortTableByColumn(trifectaStandings, "footballTrifectaPoints");
    }
  };

  sortTrifectaStandingsByTotal = () => {
    const { trifectaStandings } = this.props;
    this.sortTableByColumn(trifectaStandings, "totalTrifectaPoints");
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
      const year1 = Number(year) - 1;
      return (
        <StandingsDropdownPre2019
          navigation={navigation}
          year1={year1}
          year2={year}
        />
      );
    }

    return <StandingsDropdownPost2019 navigation={navigation} year={year} />;
  };

  render() {
    const { navigation, trifectaStandings } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    const headerRowHeight = 75;
    const totalHeight = 500;
    const totalWidth = 600;
    const widthArray = [200, 100, 100, 100, 100];

    const objectKeys = [
      "ownerNames",
      "basketballTrifectaPoints",
      "baseballTrifectaPoints",
      "totalTrifectaPoints",
    ];

    const indexToAdd = isYear1BeforeYear2(year, "2019") ? 1 : 3;

    objectKeys.splice(indexToAdd, 0, "footballTrifectaPoints");

    const headerRowMap = [
      { title: "Owner(s)", onPress: this.noop },
      {
        title: "Basketball Trifecta Points",
        onPress: this.sortTrifectaStandingsByBasketball,
      },
      {
        title: "Baseball Trifecta Points",
        onPress: this.sortTrifectaStandingsByBaseball,
      },
      {
        title: "Total Trifecta Points",
        onPress: this.sortTrifectaStandingsByTotal,
      },
    ];

    headerRowMap.splice(indexToAdd, 0, {
      title: "Football Trifecta Points",
      onPress: this.sortTrifectaStandingsByFootball,
    });

    const headerRow = headerRowMap.map(this.renderHeaderRowColumn);

    const title = isYear1BeforeYear2(year, "2019")
      ? `${year - 1} - ${year} Trifecta Standings!`
      : `${year} Trifecta Standings!`;

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.headerSection}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.dropdown}>{this.renderStandingsDropdown()}</View>
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
            data={trifectaStandings}
            totalheight={totalHeight}
            totalwidth={totalWidth}
            widthArray={widthArray}
            objectKeys={objectKeys}
            numberOfLines={2}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    getTrifectaStandings,
    getLastScraped,
  } = getTrifectaStandingsStateSelectors(state);

  return {
    trifectaStandings: getTrifectaStandings(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  calculateTrifectaStandings,
  displayTrifectaStandings,
  sortTable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrifectaStandings);
