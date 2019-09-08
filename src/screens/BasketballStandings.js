import React, { PureComponent } from "react";
import { View, Text } from "react-native";
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
    };
    this._loadClient = this._loadClient.bind(this);
  }

  componentDidMount() {
    this._loadClient();
    // this.props.scrapeBasketballStandings();
  }

  _loadClient() {
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("trifecta");
    const data = db.collection("basketballStandings");

    data
      .find({}, { sort: { totalTrifectaPoints: 1 } })
      .asArray()
      .then(docs => {
        console.log("data", docs);
        console.log("data2", docs[0]);
        this.setState({
          standings: docs[0]["2019"],
        });
      })
      .catch(err => {
        console.log("error!", err);
      });
  }

  render() {
    const { navigation, basketballStandings, lastScraped } = this.props;
    const { standings } = this.state;
    if (!standings) {
      return null;
    }
    return (
      <View style={StyleSheet.container}>
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
          data={standings}
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
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { getBasketballStandings } = getBasketballStandingsStateSelectors(
    state
  );
  console.log("hh", getBasketballStandings);

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
