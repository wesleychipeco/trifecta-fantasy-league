import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

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
import MatchupsScraper from "./screens/MatchupsScraper";

import { ROUTES } from "./Routes";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={ROUTES.Home} exact component={HomeScreen} />
        <Route
          path={ROUTES.StandingsHomeScreen}
          exact
          component={StandingsHomeScreen}
        />
        <Route
          path={ROUTES.BasketballStandings}
          exact
          component={BasketballStandings}
        />
        <Route
          path={ROUTES.BaseballStandings}
          exact
          component={BaseballStandings}
        />
        <Route
          path={ROUTES.FootballStandings}
          exact
          component={FootballStandings}
        />
        <Route
          path={ROUTES.TrifectaStandings}
          exact
          component={TrifectaStandings}
        />
      </Switch>
    </BrowserRouter>
  );
};
