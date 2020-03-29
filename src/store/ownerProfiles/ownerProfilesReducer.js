import { getStateSlice } from "../reduxUtils";
import { GET_OWNER_PROFILES_HOME_SCREEN } from "./ownerProfilesActionTypes";

const OWNER_PROFILES_STATE_PATH = "ownerProfiles";

const initialState = {
  ownerProfilesHomeScreenArray: []
};

const ownerProfilesReduer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_OWNER_PROFILES_HOME_SCREEN:
      return {
        ...state,
        ownerProfilesHomeScreenArray: payload
      };
    default:
      return state;
  }
};

const getOwnerProfilesStateSelectors = function(rootState) {
  const state = getStateSlice(rootState, OWNER_PROFILES_STATE_PATH);

  return {
    getOwnerProfilesHomeScreenArray: () => state.ownerProfilesHomeScreenArray
  };
};

export { OWNER_PROFILES_STATE_PATH, getOwnerProfilesStateSelectors };

export default ownerProfilesReduer;
