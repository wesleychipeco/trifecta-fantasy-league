// App.js - WEB
import React, { Component } from "react";
import { View, Text } from "react-native";
import WebRoutesGenerator from "./NativeWebRouteWrapper";
import { ModalContainer } from "react-router-modal";

import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";

import HomeScreen from "./screens/HomeScreen";
import SecondScreen from "./screens/SecondScreen";
import UserScreen from "./screens/UserScreen";
import DasModalScreen from "./screens/DasModalScreen";
import StandingsHomeScreen from "./screens/StandingsHomeScreen";
import BaseballStandings from "./screens/BaseballStandings";
import BasketballStandings from "./screens/BasketballStandings";
import FootballStandings from "./screens/FootballStandings";
import TrifectaStandings from "./screens/TrifectaStandings";
import MatchupsHomeScreen from "./screens/MatchupsHomeScreen";
import Matchups from "./screens/Matchups";
import TradeHistory from "./screens/TradeHistory";
import Commissioner from "./screens/Commissioner";
import OwnerProfilesHomeScreen from "./screens/OwnerProfilesHomeScreen";
import OwnerProfiles from "./screens/OwnerProfiles";
import HallOfFameHomeScreen from "./screens/HallOfFameHomeScreen";
import HallOfFameBasketball from "./screens/HallOfFameBasketball";
import HallOfFameBaseball from "./screens/HallOfFameBaseball";
import HallOfFameFootball from "./screens/HallOfFameFootball";

const routeMap = {
  Home: {
    component: HomeScreen,
    path: "/",
    exact: true,
  },
  StandingsHomeScreen: {
    component: StandingsHomeScreen,
    path: "/standingshome",
    exact: true,
  },
  BaseballStandings: {
    component: BaseballStandings,
    path: "/standings/baseball/:year?",
    exact: true,
  },
  BasketballStandings: {
    component: BasketballStandings,
    path: "/standings/basketball/:year?",
    exact: true,
  },
  FootballStandings: {
    component: FootballStandings,
    path: "/standings/football/:year?",
    exact: true,
  },
  TrifectaStandings: {
    component: TrifectaStandings,
    path: "/standings/trifecta/:year?",
    exact: true,
  },
  MatchupsHomeScreen: {
    component: MatchupsHomeScreen,
    path: "/matchupshome",
    exact: true,
  },
  Matchups: {
    component: Matchups,
    path: "/matchups/:teamNumber?/:year?",
    exact: true,
  },
  TradeHistory: {
    component: TradeHistory,
    path: "/tradehistory",
    exact: true,
  },
  Commissioner: {
    component: Commissioner,
    path: "/commissioner/wesley",
    exact: true,
  },
  OwnerProfilesHomeScreen: {
    component: OwnerProfilesHomeScreen,
    path: "/ownerprofileshome",
    exact: true,
  },
  OwnerProfiles: {
    component: OwnerProfiles,
    path: "/ownerprofiles/:teamNumber?",
    exact: true,
  },
  HallOfFameHomeScreen: {
    component: HallOfFameHomeScreen,
    path: "/halloffamehome",
    exact: true,
  },
  HallOfFameBasketball: {
    component: HallOfFameBasketball,
    path: "/halloffame/basketball",
    exact: true,
  },
  HallOfFameBaseball: {
    component: HallOfFameBaseball,
    path: "/halloffame/baseball",
    exact: true,
  },
  HallOfFameFootball: {
    component: HallOfFameFootball,
    path: "/halloffame/football",
    exact: true,
  },
  Second: {
    component: SecondScreen,
    path: "/second",
  },
  User: {
    component: UserScreen,
    path: "/user/:name?",
    exact: true,
  },
  DasModal: {
    component: DasModalScreen,
    path: "*/dasmodal",
    modal: true,
  },
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      client: undefined,
      isLoadingComplete: false,
    };

    this._loadClient = this._loadClient.bind(this);
  }

  componentDidMount() {
    this._loadClient();
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient("trifectafantasyleague-xqqjr").then(
      (client) => {
        this.setState({ client });
        this.state.client.auth
          .loginWithCredential(new AnonymousCredential())
          .then((user) => {
            console.log(`Successfully logged in as user ${user.id}`);
            this.setState({ currentUser: user.id });
            this.setState({ currentUser: client.auth.user.id });
          })
          .catch((err) => {
            console.log(`Failed to login anonymously: ${err}`);
            this.setState({ currentUser: undefined });
          });
      }
    );
  }

  render() {
    if (this.state.isLoadingComplete) {
      return (
        <View>
          <Text>Still Loading...</Text>
        </View>
      );
    }

    return (
      <View style={{ height: "100vh", width: "100vw" }}>
        {WebRoutesGenerator({ routeMap })}
        <ModalContainer />
      </View>
    );
  }
}

export default App;
