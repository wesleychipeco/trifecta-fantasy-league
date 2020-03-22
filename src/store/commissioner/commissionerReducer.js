import { getStateSlice } from "../reduxUtils";
import {
  SCRAPE_YEAR_MATCHUPS_START,
  SCRAPE_YEAR_INDIVIDUAL_MATCHUPS_SUCCESS,
  SCRAPE_YEAR_INDIVIDUAL_MATCHUPS_FAILURE,
  SCRAPE_YEAR_MATCHUPS_FINISH
} from "./commissionerActionTypes";

const COMMISSIONER_STATE_PATH = "commissioner";

const initialState = {
  yearMatchupsLoading: false,
  yearMatchupsIndividualSuccesses: [],
  yearMatchupsInidividualFailures: []
};

const commissionerReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SCRAPE_YEAR_MATCHUPS_START: {
      return {
        ...state,
        yearMatchupsLoading: true
      };
    }

    case SCRAPE_YEAR_INDIVIDUAL_MATCHUPS_SUCCESS: {
      return {
        ...state,
        yearMatchupsIndividualSuccesses: [
          ...state.yearMatchupsIndividualSuccesses,
          payload
        ]
      };
    }

    case SCRAPE_YEAR_INDIVIDUAL_MATCHUPS_FAILURE: {
      return {
        ...state,
        yearMatchupsInidividualFailures: [
          ...state.yearMatchupsInidividualFailures,
          payload
        ]
      };
    }

    case SCRAPE_YEAR_MATCHUPS_FINISH: {
      return {
        ...state,
        yearMatchupsLoading: false,
        yearMatchupsIndividualSuccesses: [],
        yearMatchupsInidividualFailures: []
      };
    }

    default: {
      return state;
    }
  }
};

const getCommissionerStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, COMMISSIONER_STATE_PATH);

  return {
    getYearMatchupsLoading: () => state.yearMatchupsLoading,
    getYearMatchupsIndividualSuccesses: () =>
      state.yearMatchupsIndividualSuccesses,
    getYearMatchupsIndividualFailures: () =>
      state.yearMatchupsInidividualFailures
  };
};

export { COMMISSIONER_STATE_PATH, getCommissionerStateSelectors };

export default commissionerReducer;
