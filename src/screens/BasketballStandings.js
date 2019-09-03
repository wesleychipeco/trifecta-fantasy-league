import React, { PureComponent } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { Row, Rows } from "../components/Row";

import { getBasketballStandingsStateSelectors } from "../store/basketballStandings/basketballStandingsReducer";
import { scrapeBasketballStandings } from "../store/basketballStandings/basketballStandingsActions";

class BasketballStandings extends PureComponent {
  componentDidMount() {
    this.props.scrapeBasketballStandings();
  }

  render() {
    const { navigation, basketballStandings, lastScraped } = this.props;
    return (
      <View style={StyleSheet.container}>
        <Rows
          data={basketballStandings}
          totalheight={500}
          totalwidth={700}
          widthArray={[200, 100, 100, 100, 100, 100]}
          objectKeys={["teamName", "wins", "losses", "ties", "winPer"]}
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
