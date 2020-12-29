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
import commissionerReducer, {
  COMMISSIONER_STATE_PATH,
} from "./commissioner/commissionerReducer";
import ownerProfilesReducer, {
  OWNER_PROFILES_STATE_PATH,
} from "./ownerProfiles/ownerProfilesReducer";
import basketballHallOfFameReducer, {
  BASKETBALL_HALL_OF_FAME_STATE_PATH,
} from "./hallOfFame/basketballHallOfFameReducer";

export default {
  [BASEBALL_STANDINGS_STATE_PATH]: baseballStandingsReducer,
  [BASKETBALL_STANDINGS_STATE_PATH]: basketballStandingsReducer,
  [FOOTBALL_STANDINGS_STATE_PATH]: footballStandingsReducer,
  [TRIFECTA_STANDINGS_STATE_PATH]: trifectaStandingsReducer,
  [MATCHUPS_STATE_PATCH]: matchupsReducer,
  [TRADE_HISTORY_STATE_PATH]: tradeHistoryReducer,
  [COMMISSIONER_STATE_PATH]: commissionerReducer,
  [OWNER_PROFILES_STATE_PATH]: ownerProfilesReducer,
  [BASKETBALL_HALL_OF_FAME_STATE_PATH]: basketballHallOfFameReducer,
};
