import baseballStandingsReducer, {
  BASEBALL_STANDINGS_STATE_PATH,
} from "./baseballStandings/baseballStandingsReducer";
import basketballStandingsReducer, {
  BASKETBALL_STANDINGS_STATE_PATH,
} from "./basketballStandings/basketballStandingsReducer";

export default {
  [BASEBALL_STANDINGS_STATE_PATH]: baseballStandingsReducer,
  [BASKETBALL_STANDINGS_STATE_PATH]: basketballStandingsReducer,
};
