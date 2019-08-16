import baseballStandingsReducer, {
  BASEBALL_STANDINGS_STATE_PATH,
} from "./standings/baseballStandingsReducer";

export default {
  [BASEBALL_STANDINGS_STATE_PATH]: baseballStandingsReducer,
};
