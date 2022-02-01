import React, { PureComponent, Fragment } from "react";
import { View, Text } from "react-native";

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
      alreadyScraped: false,
      showCommissionerPage: false,
    };
  }

  noop = () => {};

  async componentDidMount() {
    const seasonVariablesCollection = await returnMongoCollection(
      "seasonVariables"
    );
    seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then((seasonVariables) => {
        const { currentYear, showCommissionerPage } = seasonVariables[0];
        const lastYearNumber = Number(currentYear) - 1;
        this.setState({
          showCommissionerPage,
          completedYear: lastYearNumber.toString(),
        });
      });
  }

  componentDidUpdate() {
    const { matchupsLoading, matchupsSuccesses, matchupsFailures } = this.props;
    const matchupsScrapeNumber =
      matchupsSuccesses.length + matchupsFailures.length;

    if (!matchupsLoading && matchupsScrapeNumber === 10) {
      this.setState({
        showYearMatchupsScrapeOverlay: true,
      });
    }
  }

  closeOverlay = () => {
    this.setState({
      alreadyScraped: true,
      showYearMatchupsScrapeOverlay: false,
    });
  };

  renderYearMatchupsScrapeOverlay = () => {
    const { matchupsSuccesses, matchupsFailures } = this.props;
    const { completedYear, showYearMatchupsScrapeOverlay, alreadyScraped } =
      this.state;

    if (showYearMatchupsScrapeOverlay && !alreadyScraped) {
      const title = `${completedYear} Matchups Scrape Complete`;
      return (
        <View style={styles.overlayBackground}>
          <View style={styles.overlayContainer}>
            <Text style={styles.matchupsScrapeOverlayTitle}>{title}</Text>
            <Text
              style={styles.matchupsScrapeOverlayText}
            >{`${matchupsSuccesses.length} successful scrapes: ${matchupsSuccesses}`}</Text>
            <Text
              style={styles.matchupsScrapeOverlayText}
            >{`${matchupsFailures.length} unsuccessful scrapes: ${matchupsFailures}`}</Text>
            <MyButton
              touchableStyles={styles.matchupsScrapeOverlayButton}
              textStyles={styles.commissionerButtonText}
              title="Close"
              onPress={this.closeOverlay}
            />
          </View>
        </View>
      );
    }
  };

  shouldRenderCommissionerOptions = () => {
    const { showCommissionerPage, completedYear } = this.state;
    if (showCommissionerPage) {
      const buttonText = `Scrape ${completedYear} Matchups into All-Time Matchups`;

      return (
        <Fragment>
          <MyButton
            touchableStyles={styles.commissionerButton}
            textStyles={styles.commissionerButtonText}
            title={buttonText}
            onPress={this.makeCall}
          />
          {this.renderYearMatchupsScrapeOverlay()}
        </Fragment>
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
      "You found the secret commissioner page. If the page is blank, you are not the commissioner";

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtext}>{captionText}</Text>
        {this.shouldRenderCommissionerOptions()}
      </View>
    );
  }
}

const mapDispatchToProps = {
  scrapeYearAllMatchups,
};

const mapStateToProps = (state) => {
  const {
    getYearMatchupsLoading,
    getYearMatchupsIndividualSuccesses,
    getYearMatchupsIndividualFailures,
  } = getCommissionerStateSelectors(state);

  return {
    matchupsLoading: getYearMatchupsLoading(),
    matchupsSuccesses: getYearMatchupsIndividualSuccesses(),
    matchupsFailures: getYearMatchupsIndividualFailures(),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Commissioner);
