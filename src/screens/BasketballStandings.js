import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";

import { getBasketballStandingsStateSelectors } from "../store/basketballStandings/basketballStandingsReducer";
import { scrapeBasketballStandings } from "../store/basketballStandings/basketballStandingsActions";

class BasketballStandings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      client: undefined,
      standings: [],
      inSeason: false,
      inPlayoffs: false,
    };
    this._loadClient = this._loadClient.bind(this);
  }

  componentDidMount() {
    const { inSeason, inPlayoffs } = this.state;
    if (!inSeason && !inPlayoffs) {
      this._loadClient();
    } else {
      this.props.scrapeBasketballStandings();
    }
  }

  _loadClient() {
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("trifecta");
    const data = db.collection("basketballStandings2019");

    data
      .find({}, { sort: { totalTrifectaPoints: -1 } })
      .asArray()
      .then(docs => {
        this.setState({
          standings: docs,
        });
      })
      .catch(err => {
        console.log("error!", err);
      });
  }

  render() {
    const { navigation, basketballStandings, lastScraped } = this.props;
    const { standings, inSeason, inPlayoffs } = this.state;

    const standingsToDisplay =
      !inSeason && !inPlayoffs ? standings : basketballStandings;

    if (!standings && !basketballStandings) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Basketball Standings!</Text>
        <Row
          data={[
            "Team Name",
            "Wins",
            "Losses",
            "Ties",
            "Win %",
            "Trifecta Points",
            "Playoff Points",
            "Total Trifecta Points",
          ]}
          height={75}
          widthArray={[200, 100, 100, 100, 100, 100, 100, 100]}
        />
        <Rows
          data={standingsToDisplay}
          totalheight={500}
          totalwidth={900}
          widthArray={[200, 100, 100, 100, 100, 100, 100, 100]}
          objectKeys={[
            "teamName",
            "wins",
            "losses",
            "ties",
            "winPer",
            "trifectaPoints",
            "playoffPoints",
            "totalTrifectaPoints",
          ]}
        />
        <Button
          title="Go to Baseball Standings!"
          onPress={() => navigation.navigate("BaseballStandings")}
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
  const { getBasketballStandings } = getBasketballStandingsStateSelectors(
    state
  );

  return {
    basketballStandings: getBasketballStandings(),
  };
};

const mapDispatchToProps = {
  scrapeBasketballStandings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasketballStandings);
