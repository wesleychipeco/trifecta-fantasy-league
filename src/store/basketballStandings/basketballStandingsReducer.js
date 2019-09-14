import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_BASKETBALL_STANDINGS_START,
  SCRAPE_BASKETBALL_STANDINGS_SUCCESS,
  SCRAPE_BASKETBALL_STANDINGS_FAILED,
  SAVE_BASKETBALL_STANDINGS,
  SORT_TABLE,
} from "./basketballStandingsActionTypes";

const BASKETBALL_STANDINGS_STATE_PATH = "basketballStandings";

const initialState = {
  basketballStandingsLoading: false,
  basketballStandingsSuccess: false,
  basketballStandings: [],
  lastScraped: null,
};

const basketballStandingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SCRAPE_BASKETBALL_STANDINGS_START: {
      return {
        ...state,
        basketballStandingsLoading: true,
        basketballStandingsSuccess: false,
      };
    }
    case SCRAPE_BASKETBALL_STANDINGS_SUCCESS: {
      return {
        ...state,
        basketballStandingsLoading: false,
        basketballStandingsSuccess: true,
      };
    }
    case SCRAPE_BASKETBALL_STANDINGS_FAILED: {
      return {
        ...state,
        basketballStandingsLoading: false,
        basketballStandingsSuccess: false,
      };
    }
    case SAVE_BASKETBALL_STANDINGS: {
      return {
        ...state,
        basketballStandings: payload,
      };
    }
    case SORT_TABLE: {
      return {
        ...state,
        basketballStandings: payload,
      };
    }
    default:
      return state;
  }
};

const getBasketballStandingsStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, BASKETBALL_STANDINGS_STATE_PATH);

  return {
    getBasketballStandings: () => state.basketballStandings,
  };
};

export {
  BASKETBALL_STANDINGS_STATE_PATH,
  getBasketballStandingsStateSelectors,
};

export default basketballStandingsReducer;
