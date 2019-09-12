import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";

import { getFootballStandingsStateSelectors } from "../store/footballStandings/footballStandingsReducer";
import {
  scrapeFootballStandings,
  displayFootballStandings,
  sortTable,
} from "../store/footballStandings/footballStandingsActions";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/footballStandings";
import { returnMongoCollection } from "../databaseManagement";

class FootballStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      inSeason: undefined,
      started: undefined,
      footballStandings: {
        sortedColumn: "trifectaPoints",
        highToLow: true,
      },
    };
  }

  componentDidMount() {
    const { lastScraped, navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    const seasonVariablesCollection = returnMongoCollection("seasonVariables");
    seasonVariablesCollection
      .find({})
      .asArray()
      .then(seasonVariables => {
        const { inSeason, started } = seasonVariables[0].football;

        this.setState({
          inSeason,
          started,
        });

        if (inSeason && !lastScraped) {
          this.props.scrapeFootballStandings(year);
        } else {
          this.props.displayFootballStandings(year);
        }
      });
  }

  render() {
    const { navigation, footballStandings, lastScraped } = this.props;
    const { inSeason, started } = this.state;

    const headerRowHeight = 75;
    const totalHeight = 500;
    const totalWidth = inSeason ? 900 : 1100;
    const widthArray = [200, 100, 100, 100, 100, 100, 100, 100];
    const objectKeys = [
      "teamName",
      "wins",
      "losses",
      "ties",
      "winPer",
      "pointsFor",
      "pointsAgainst",
      "trifectaPoints",
    ];

    if (started === false) {
      return (
        <View>
          <Text>Not in season yet!</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Football Standings!</Text>
        <Text>{lastScraped}</Text>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text style={{ alignSelf: "flex-start" }}>Football Standings</Text>
          {/* <Row
            data={headerRow}
            height={headerRowHeight}
            totalWidth={totalWidth}
            widthArray={widthArray}
            rowStyle={{ backgroundColor: "#BEBEBE" }}
          /> */}
          <Rows
            data={footballStandings}
            totalheight={totalHeight}
            totalwidth={totalWidth}
            widthArray={widthArray}
            objectKeys={objectKeys}
          />
        </View>

        <Button
          title="Go to 2019 Basketball Standings!"
          onPress={() =>
            navigation.navigate("BasketballStandings", { year: "2019" })
          }
        />
        <Button
          title="Go to 2019 Baseball Standings!"
          onPress={() =>
            navigation.navigate("BaseballStandings", { year: "2019" })
          }
        />
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
  const { getFootballStandings } = getFootballStandingsStateSelectors(state);

  return {
    footballStandings: getFootballStandings(),
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
