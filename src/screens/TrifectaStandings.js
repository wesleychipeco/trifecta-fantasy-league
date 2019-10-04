import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { Navbar } from "../components/Navbar";
import { getTrifectaStandingsStateSelectors } from "../store/trifectaStandings/trifectaStandingsReducer";
import {
  calculateTrifectaStandings,
  displayTrifectaStandings,
  sortTable,
} from "../store/trifectaStandings/trifectaStandingsActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/trifectaStandings";
import { sortArrayBy, isYear1BeforeYear2 } from "../utils";
import { LinkText } from "../components/LinkText";
import { returnMongoCollection } from "../databaseManagement";
import { standingsStyles as styles } from "../styles/globalStyles";

class TrifectaStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: null,
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
            basketballStandings: {
              sortedColumn: "totalTrifectaPoints",
              highToLow: true,
            },
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
    const { basketballSeasonEnded } = this.state;
    if (basketballSeasonEnded) {
      this.sortTableByColumn(trifectaStandings, "basketballTrifectaPoints");
    }
  };

  sortTrifectaStandingsByBaseball = () => {
    const { trifectaStandings } = this.props;
    const { baseballSeasonEnded } = this.state;
    if (baseballSeasonEnded) {
      this.sortTableByColumn(trifectaStandings, "baseballTrifectaPoints");
    }
  };

  sortTrifectaStandingsByFootball = () => {
    const { trifectaStandings } = this.props;
    const { footballSeasonEnded } = this.state;
    if (footballSeasonEnded) {
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
        <Text style={styles.title}>{title}</Text>
        {/* <Text>{lastScraped}</Text> */}
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
