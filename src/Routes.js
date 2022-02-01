export const ROUTES = {
  Home: "/",
  StandingsHomeScreen: "/standingshome",
  BaseballStandings: "/standings/baseball/:year?",
  BasketballStandings: "/standings/basketball/:year?",
  FootballStandings: "/standings/football/:year?",
  TrifectaStandings: "/standings/trifecta/:year?",
  MatchupsHomeScreen: "/matchupshome",
  Matchups: "/matchups/:teamNumber?/:year?",
  TradeHistory: "/tradehistory",
  Commissioner: "/commissioner/wesley",
  OwnerProfilesHomeScreen: "/ownerprofileshome",
  OwnerProfiles: "/ownerprofiles/:teamNumber?",
  HallOfFameHomeScreen: "/halloffamehome",
  HallOfFameBasketball: "/halloffame/basketball",
  HallOfFameBaseball: "/halloffame/baseball",
  HallOfFameFootball: "/halloffame/football",
  MatchupsScraper: "/matchupsscraper/:year?",
};

export const BASE_ROUTES = {
  BasketballStandings: "/standings/basketball",
};
