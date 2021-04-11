import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";

import { scrapeDynastyBaseballStandings } from "../store/dynastyBaseballStandings/dynastyBaseballStandingsActions";
import { getDynastyBaseballStandingsStateSelectors } from "../store/dynastyBaseballStandings/dynastyBaseballStandingsReducer";

class DynastyBaseballStandings extends PureComponent {
  componentDidMount() {
    const { lastScraped, navigation } = this.props;
    const year = navigation.getParam("year", "No year was defined!");

    const { scrapeDynastyBaseballStandings } = this.props;

    scrapeDynastyBaseballStandings(year);
    // return [h2hStandingsArray, rotoStatsArray];
    // });
  }

  render() {
    return <div>Hi</div>;
  }
}

const mapStateToProps = (state) => {
  const {
    getStandings,
    getLastScraped,
  } = getDynastyBaseballStandingsStateSelectors(state);

  return {
    standings: getStandings(),
    lastScraped: getLastScraped(),
  };
};

const mapDispatchToProps = {
  scrapeDynastyBaseballStandings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DynastyBaseballStandings);
