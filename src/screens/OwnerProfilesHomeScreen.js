import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { OwnerProfilesDropdown } from "../components/OwnerProfilesDropdown";
import { returnMongoCollection } from "../databaseManagement";
import { homeScreenStyles as styles } from "../styles/globalStyles";
import { isEmptyArray, sortArrayBy } from "../utils";

export class OwnerProfilesHomeScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ownerProfilesHomeScreenArray: [],
    };
  }

  async componentDidMount() {
    const ownerProfilesCollection = await returnMongoCollection(
      "ownerProfiles"
    );

    ownerProfilesCollection
      .find({}, { projection: { _id: 0, teamNumber: 1, ownerNames: 1 } })
      .asArray()
      .then((docs) => {
        this.setState({
          ownerProfilesHomeScreenArray: sortArrayBy(docs, "teamNumber", false),
        });
      });
  }

  renderOwnerProfilesDropdown = (teamObject, index) => {
    const { teamNumber, ownerNames } = teamObject;

    return (
      <View style={{ marginVertical: 5 }} key={index}>
        <OwnerProfilesDropdown
          navigation={this.props.navigation}
          teamNumber={teamNumber}
          ownerNames={ownerNames}
        />
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { ownerProfilesHomeScreenArray } = this.state;

    if (isEmptyArray(ownerProfilesHomeScreenArray)) {
      return <LoadingIndicator />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Owner Profiles</Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            marginTop: 20,
          }}
        >
          {this.state.ownerProfilesHomeScreenArray.map(
            this.renderOwnerProfilesDropdown
          )}
        </View>
      </View>
    );
  }
}

export default OwnerProfilesHomeScreen;
