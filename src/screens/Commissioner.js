import React, { PureComponent } from "react";
import { View, Text } from "react-native";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/tradeHistory";
import { Navbar } from "../components/Navbar";
import { sortArrayBy, isEmptyArray } from "../utils";
import { LinkText } from "../components/LinkText";
import { commissionerStyles as styles } from "../styles/globalStyles";
import { returnMongoCollection } from "../databaseManagement";
import { MyButton } from "../components/MyButton";
import { retrieveYearMatchups } from "../store/commissioner/commissionerActions";
import { connect } from "react-redux";

class Commissioner extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      completedYear: null
    };
  }

  noop = () => {};

  componentDidMount() {
    const seasonVariablesCollection = returnMongoCollection("seasonVariables");
    seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then(seasonVariables => {
        const { currentYear } = seasonVariables[0];
        const lastYearNumber = Number(currentYear) - 1;
        this.setState({
          completedYear: lastYearNumber.toString()
        });
      });
  }

  makeCall = () => {
    this.props.retrieveYearMatchups(this.state.completedYear);
  };

  render() {
    const { navigation } = this.props;

    const title = "Commissioner Website Tools Page";
    const captionText =
      "Please don't do anything on this page, if you are not the commissioner";

    console.log("ttttt", this.state.completedYear);

    const buttonText = `Scrape ${this.state.completedYear} Matchups into All-Time Matchups`;

    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtext}>{captionText}</Text>
        <MyButton
          touchableStyles={{
            borderWidth: 2,
            borderColor: "#000000",
            backgroundColor: "#007FFF",
            padding: 5
          }}
          textStyles={{ color: "#FFFFFF" }}
          title={buttonText}
          onPress={this.makeCall}
        />
      </View>
    );
  }
}

const mapDispatchToProps = {
  retrieveYearMatchups
};

export default connect(null, mapDispatchToProps)(Commissioner);
