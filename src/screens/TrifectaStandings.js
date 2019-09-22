import React, { PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
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
import { sortArrayBy } from "../utils";
import { LinkText } from "../components/LinkText";
import { returnMongoCollection } from "../databaseManagement";

class TrifectaStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
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
    const { lastScraped, navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    const seasonVariablesCollection = returnMongoCollection("seasonVariables");
    seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then(seasonVariables => {
        const basketballSeasonVariables = seasonVariables[0].basketball;
        const basketballSeasonEnded = this.isSeasonEnded(
          basketballSeasonVariables
        );

        const baseballSeasonVariables = seasonVariables[0].baseball;
        const baseballSeasonEnded = this.isSeasonEnded(baseballSeasonVariables);

        const footballSeasonVariables = seasonVariables[0].football;
        const footballSeasonEnded = this.isSeasonEnded(footballSeasonVariables);

        this.setState({
          basketballSeasonEnded,
          baseballSeasonEnded,
          footballSeasonEnded,
          basketballStandings: {
            sortedColumn: "totalTrifectaPoints",
            highToLow: true,
          },
        });

        if (!lastScraped) {
          this.props.calculateTrifectaStandings(
            year,
            basketballSeasonEnded,
            baseballSeasonEnded,
            footballSeasonEnded
          );
        } else {
          this.props.displayTrifectaStandings(year);
        }
      });
  }

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
        textStyles={{ color: "#0041C2" }}
      />
    );
  };

  render() {
    const { navigation, trifectaStandings } = this.props;

    const headerRowHeight = 75;
    const totalHeight = 500;
    const totalWidth = 600;
    const widthArray = [200, 100, 100, 100, 100];
    const objectKeys = [
      "ownerNames",
      "basketballTrifectaPoints",
      "baseballTrifectaPoints",
      "footballTrifectaPoints",
      "totalTrifectaPoints",
    ];

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
        title: "Football Trifecta Points",
        onPress: this.sortTrifectaStandingsByFootball,
      },
      {
        title: "Total Trifecta Points",
        onPress: this.sortTrifectaStandingsByTotal,
      },
    ];

    const headerRow = headerRowMap.map(this.renderHeaderRowColumn);

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <Text style={styles.welcome}>Trifecta Standings!</Text>
        {/* <Text>{lastScraped}</Text> */}
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>Trifecta Standings</Text>
          <Row
            data={headerRow}
            height={headerRowHeight}
            totalWidth={totalWidth}
            widthArray={widthArray}
            rowStyle={{ backgroundColor: "#BEBEBE" }}
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
