import baseballStandingsReducer, {
  BASEBALL_STANDINGS_STATE_PATH,
} from "./baseballStandings/baseballStandingsReducer";
import basketballStandingsReducer, {
  BASKETBALL_STANDINGS_STATE_PATH,
} from "./basketballStandings/basketballStandingsReducer";
import footballStandingsReducer, {
  FOOTBALL_STANDINGS_STATE_PATH,
} from "./footballStandings/footballStandingsReducer";
import trifectaStandingsReducer, {
  TRIFECTA_STANDINGS_STATE_PATH,
} from "./trifectaStandings/trifectaStandingsReducer";
import matchupsReducer, {
  MATCHUPS_STATE_PATCH,
} from "./matchups/matchupsReducer";
import tradeHistoryReducer, {
  TRADE_HISTORY_STATE_PATH,
} from "./tradeHistory/tradeHistoryReducer";

export default {
  [BASEBALL_STANDINGS_STATE_PATH]: baseballStandingsReducer,
  [BASKETBALL_STANDINGS_STATE_PATH]: basketballStandingsReducer,
  [FOOTBALL_STANDINGS_STATE_PATH]: footballStandingsReducer,
  [TRIFECTA_STANDINGS_STATE_PATH]: trifectaStandingsReducer,
  [MATCHUPS_STATE_PATCH]: matchupsReducer,
  [TRADE_HISTORY_STATE_PATH]: tradeHistoryReducer,
};
