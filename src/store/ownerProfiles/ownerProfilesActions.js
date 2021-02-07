import { createAction } from "redux-starter-kit";
import { GET_OWNER_PROFILE_SEASONS_RECAP } from "./ownerProfilesActionTypes";
import { returnMongoCollection } from "../../databaseManagement";

const actions = {
  getOwnerProfileSeasonsRecap: createAction(GET_OWNER_PROFILE_SEASONS_RECAP),
};

const displaySeasonsRecap = (teamNumber) => {
  return async function (dispatch) {
    const ownerProfilesCollection = await returnMongoCollection(
      "ownerProfiles"
    );

    ownerProfilesCollection
      .find(
        { teamNumber: parseInt(teamNumber, 10) },
        { projection: { _id: 0 } }
      )
      .asArray()
      .then((docs) => {
        dispatch(actions.getOwnerProfileSeasonsRecap(docs[0]));
      })
      .catch((err) => {
        console.log("ERROR!", err);
      });
  };
};

export { displaySeasonsRecap };
