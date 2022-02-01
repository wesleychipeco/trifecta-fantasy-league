import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { ROUTES } from "./Routes";
import HomeScreen from "./screens/HomeScreen";
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

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={ROUTES.Home} component={HomeScreen} exact />
        <Route
          path={ROUTES.StandingsHomeScreen}
          component={StandingsHomeScreen}
          exact
        />
        <Route
          path={ROUTES.BaseballStandings}
          component={BaseballStandings}
          exact
        />
        <Route
          path={ROUTES.BasketballStandings}
          component={BasketballStandings}
        />
        <Route
          path={ROUTES.FootballStandings}
          component={FootballStandings}
          exact
        />
        <Route
          path={ROUTES.TrifectaStandings}
          component={TrifectaStandings}
          exact
        />
        <Route
          path={ROUTES.MatchupsHomeScreen}
          component={MatchupsHomeScreen}
          exact
        />
        <Route path={ROUTES.Matchups} component={Matchups} exact />
        <Route path={ROUTES.TradeHistory} component={TradeHistory} />
        <Route path={ROUTES.Commissioner} component={Commissioner} exact />
        <Route
          path={ROUTES.OwnerProfilesHomeScreen}
          component={OwnerProfilesHomeScreen}
          exact
        />
        <Route path={ROUTES.OwnerProfiles} component={OwnerProfiles} exact />
        <Route
          path={ROUTES.HallOfFameHomeScreen}
          component={HallOfFameHomeScreen}
          exact
        />
        <Route
          path={ROUTES.HallOfFameBasketball}
          component={HallOfFameBasketball}
          exact
        />
        <Route
          path={ROUTES.HallOfFameBaseball}
          component={HallOfFameBaseball}
          exact
        />
        <Route
          path={ROUTES.HallOfFameFootball}
          component={HallOfFameFootball}
          exact
        />
        <Route
          path={ROUTES.MatchupsScraper}
          component={MatchupsScraper}
          exact
        />
      </Switch>
    </BrowserRouter>
  );
};
