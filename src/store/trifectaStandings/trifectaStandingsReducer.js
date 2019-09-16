import { getStateSlice } from "../reduxUtils";
import {
  SAVE_CALCULATED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SET_TRIFECTA_STANDINGS_LAST_SCRAPED,
  SORT_TRIFECTA_STANDINGS_TABLE,
} from "./trifectaStandingsActionTypes";

const TRIFECTA_STANDINGS_STATE_PATH = "trifectaStandings";

const initialState = {
  trifectaStandings: [],
  lastScraped: null,
};

const trifectaStandingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SAVE_CALCULATED_TRIFECTA_STANDINGS: {
      return {
        ...state,
        trifectaStandings: payload,
      };
    }
    case SAVE_EXISTING_TRIFECTA_STANDINGS: {
      return {
        ...state,
        trifectaStandings: payload,
      };
    }
    case SET_TRIFECTA_STANDINGS_LAST_SCRAPED: {
      return {
        ...state,
        lastScraped: payload,
      };
    }
    case SORT_TRIFECTA_STANDINGS_TABLE: {
      return {
        ...state,
        trifectaStandings: payload,
      };
    }
    default:
      return state;
  }
};

const getTrifectaStandingsStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, TRIFECTA_STANDINGS_STATE_PATH);

  return {
    getTrifectaStandings: () => state.trifectaStandings,
    getLastScraped: () => state.lastScraped,
  };
};

export { TRIFECTA_STANDINGS_STATE_PATH, getTrifectaStandingsStateSelectors };

export default trifectaStandingsReducer;
