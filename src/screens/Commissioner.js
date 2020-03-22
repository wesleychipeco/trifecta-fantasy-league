import React, { PureComponent } from "react";
import { View, Text } from "react-native";

import { tableDefaultSortDirections } from "../consts/tableDefaultSortDirections/tradeHistory";
import { Navbar } from "../components/Navbar";
import { sortArrayBy, isEmptyArray } from "../utils";
import { LinkText } from "../components/LinkText";
import { commissionerStyles as styles } from "../styles/globalStyles";
import { returnMongoCollection } from "../databaseManagement";
import { MyButton } from "../components/MyButton";
import { scrapeYearAllMatchups } from "../store/commissioner/commissionerActions";
import { getCommissionerStateSelectors } from "../store/commissioner/commissionerReducer";
import { connect } from "react-redux";

class Commissioner extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      completedYear: null,
      showYearMatchupsScrapeOverlay: false,
      alreadyScraped: false
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

  componentDidUpdate() {
    const { matchupsLoading, matchupsSuccesses, matchupsFailures } = this.props;
    const matchupsScrapeNumber =
      matchupsSuccesses.length + matchupsFailures.length;

    if (!matchupsLoading && matchupsScrapeNumber === 10) {
      this.setState({
        showYearMatchupsScrapeOverlay: true
      });
    }
  }

  closeOverlay = () => {
    this.setState({
      alreadyScraped: true,
      showYearMatchupsScrapeOverlay: false
    });
  };

  renderYearMatchupsScrapeOverlay = () => {
    const { matchupsSuccesses, matchupsFailures } = this.props;
    const {
      completedYear,
      showYearMatchupsScrapeOverlay,
      alreadyScraped
    } = this.state;

    if (showYearMatchupsScrapeOverlay && !alreadyScraped) {
      const title = `${completedYear} Matchups Scrape Complete`;
      return (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.35)"
          }}
        >
          <View
            style={{
              width: 400,
              height: 150,
              backgroundColor: "#FFFFFF",
              padding: 10
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 12 }}>{title}</Text>
            <Text
              style={{ fontSize: 16, marginBottom: 6 }}
            >{`${matchupsSuccesses.length} successful scrapes: ${matchupsSuccesses}`}</Text>
            <Text
              style={{ fontSize: 16, marginBottom: 6 }}
            >{`${matchupsFailures.length} unsuccessful scrapes: ${matchupsFailures}`}</Text>
            <MyButton
              touchableStyles={{
                width: "50%",
                borderWidth: 2,
                borderColor: "#000000",
                backgroundColor: "#007FFF",
                padding: 5,
                alignSelf: "center"
              }}
              textStyles={{ color: "#FFFFFF" }}
              title="Close"
              onPress={this.closeOverlay}
            />
          </View>
        </View>
      );
    }
  };

  makeCall = () => {
    const { completedYear, alreadyScraped } = this.state;
    if (completedYear && !alreadyScraped) {
      this.props.scrapeYearAllMatchups(completedYear);
    }
  };

  render() {
    const { navigation } = this.props;

    const title = "Commissioner Website Tools Page";
    const captionText =
      "Please don't do anything on this page, if you are not the commissioner";

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
        {this.renderYearMatchupsScrapeOverlay()}
      </View>
    );
  }
}

const mapDispatchToProps = {
  scrapeYearAllMatchups
};

const mapStateToProps = state => {
  const {
    getYearMatchupsLoading,
    getYearMatchupsIndividualSuccesses,
    getYearMatchupsIndividualFailures
  } = getCommissionerStateSelectors(state);

  return {
    matchupsLoading: getYearMatchupsLoading(),
    matchupsSuccesses: getYearMatchupsIndividualSuccesses(),
    matchupsFailures: getYearMatchupsIndividualFailures()
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Commissioner);
