import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { Navbar } from "../components/Navbar";
import { homeScreenStyles as styles } from "../styles/globalStyles";
import { returnMongoCollection } from "../databaseManagement";
import { MatchupsDropdown } from "../components/MatchupsDropdown";

export class MatchupsHomeScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      teamObjectsArray: null,
    };
  }

  componentDidMount() {
    const allTimeTeamsCollection = returnMongoCollection("allTimeTeams");

    allTimeTeamsCollection
      .find({}, { projection: { _id: 0, ownerIds: 0 } })
      .asArray()
      .then(teamObjectsArray => {
        this.setState({
          teamObjectsArray,
        });
      });
  }

  renderTeamMatchupsDropdown = (teamObject, index) => {
    const { navigation } = this.props;
    const { teamNumber, ownerNames } = teamObject;

    return (
      <MatchupsDropdown
        key={index}
        navigation={navigation}
        teamNumber={teamNumber}
        ownerNames={ownerNames}
      />
    );
  };

  render() {
    const { navigation } = this.props;

    if (!this.state.teamObjectsArray) {
      return null;
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
            marginTop: 20,
          }}
        >
          {this.state.teamObjectsArray.map(this.renderTeamMatchupsDropdown)}
        </View>
      </View>
    );
  }
}

export default MatchupsHomeScreen;
