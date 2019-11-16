import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { Navbar } from "../components/Navbar";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { MatchupsDropdown } from "../components/MatchupsDropdown";
import { returnMongoCollection } from "../databaseManagement";
import { homeScreenStyles as styles } from "../styles/globalStyles";
import { isEmptyArray } from "../utils";

export class MatchupsHomeScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      teamObjectsArray: []
    };
  }

  componentDidMount() {
    const allTimeTeamsCollection = returnMongoCollection("allTimeTeams");

    allTimeTeamsCollection
      .find({}, { projection: { _id: 0, ownerIds: 0 } })
      .asArray()
      .then(teamObjectsArray => {
        this.setState({
          teamObjectsArray
        });
      });
  }

  renderTeamMatchupsDropdown = (teamObject, index) => {
    const { navigation } = this.props;
    const { teamNumber, ownerNames } = teamObject;

    return (
      <View style={{ marginVertical: 5 }} key={index}>
        <MatchupsDropdown
          navigation={navigation}
          teamNumber={teamNumber}
          ownerNames={ownerNames}
        />
      </View>
    );
  };

  render() {
    const { navigation } = this.props;

    if (isEmptyArray(this.state.teamObjectsArray)) {
      return <LoadingIndicator />;
    }

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.header}>
          <Text style={styles.welcome}>
            Historical Head-to-Head Owner Matchups
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            marginTop: 20
          }}
        >
          {this.state.teamObjectsArray.map(this.renderTeamMatchupsDropdown)}
        </View>
      </View>
    );
  }
}

export default MatchupsHomeScreen;
