import baseballStandingsReducer, {
  BASEBALL_STANDINGS_STATE_PATH,
} from "./baseballStandings/baseballStandingsReducer";

export default {
  [BASEBALL_STANDINGS_STATE_PATH]: baseballStandingsReducer,
};
