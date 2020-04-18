import { getStateSlice } from "../reduxUtils";
import { GET_OWNER_PROFILE_SEASONS_RECAP } from "./ownerProfilesActionTypes";

const OWNER_PROFILES_STATE_PATH = "ownerProfiles";

const initialState = {
  ownerNames: "",
  trifectaHistory: [],
  allTimeRecords: [],
  allTimeBasketball: [],
  allTimeBaseball: [],
  allTimeFootball: []
};

const ownerProfilesReduer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_OWNER_PROFILE_SEASONS_RECAP:
      const {
        ownerNames,
        trifectaHistory,
        allTimeRecords,
        allTimeBasketball,
        allTimeBaseball,
        allTimeFootball
      } = payload;

      return {
        ...state,
        ownerNames,
        trifectaHistory,
        allTimeRecords,
        allTimeBasketball,
        allTimeBaseball,
        allTimeFootball
      };
    default:
      return state;
  }
};

const getOwnerProfilesStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, OWNER_PROFILES_STATE_PATH);

  return {
    getOwnerNames: () => state.ownerNames,
    getTrifectaHistory: () => state.trifectaHistory,
    getAllTimeRecords: () => state.allTimeRecords,
    getAllTimeBasketball: () => state.allTimeBasketball,
    getAllTimeBaseball: () => state.allTimeBaseball,
    getAllTimeFootball: () => state.allTimeFootball
  };
};

export { OWNER_PROFILES_STATE_PATH, getOwnerProfilesStateSelectors };

export default ownerProfilesReduer;
