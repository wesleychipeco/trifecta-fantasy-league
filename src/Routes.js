export const BASE_ROUTES = {
  Home: "/",
  StandingsHomeScreen: "/standingshome",
  BaseballStandings: "/standings/baseball",
  BasketballStandings: "/standings/basketball",
  FootballStandings: "/standings/football",
  TrifectaStandings: "/standings/trifecta",
  MatchupsHomeScreen: "/matchupshome",
  Matchups: "/matchups",
  TradeHistory: "/tradehistory",
  Commissioner: "/commissioner/wesley",
  OwnerProfilesHomeScreen: "/ownerprofileshome",
  OwnerProfiles: "/ownerprofiles",
  HallOfFameHomeScreen: "/halloffamehome",
  HallOfFameBasketball: "/halloffame/basketball",
  HallOfFameBaseball: "/halloffame/baseball",
  HallOfFameFootball: "/halloffame/football",
  MatchupsScraper: "/matchupsscraper",
};

export const ROUTES = {
  ...BASE_ROUTES,
  BaseballStandings: "/standings/baseball/:year?",
  BasketballStandings: "/standings/basketball/:year?",
  FootballStandings: "/standings/football/:year?",
  TrifectaStandings: "/standings/trifecta/:year?",
  Matchups: "/matchups/:teamNumber?/:year?",
  OwnerProfiles: "/ownerprofiles/:teamNumber?",
  MatchupsScraper: "/matchupsscraper/:year?",
};
