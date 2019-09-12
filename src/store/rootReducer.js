import baseballStandingsReducer, {
  BASEBALL_STANDINGS_STATE_PATH,
} from "./baseballStandings/baseballStandingsReducer";
import basketballStandingsReducer, {
  BASKETBALL_STANDINGS_STATE_PATH,
} from "./basketballStandings/basketballStandingsReducer";
import footballStandingsReducer, {
  FOOTBALL_STANDINGS_STATE_PATH,
} from "./footballStandings/footballStandingsReducer";

export default {
  [BASEBALL_STANDINGS_STATE_PATH]: baseballStandingsReducer,
  [BASKETBALL_STANDINGS_STATE_PATH]: basketballStandingsReducer,
  [FOOTBALL_STANDINGS_STATE_PATH]: footballStandingsReducer,
};
