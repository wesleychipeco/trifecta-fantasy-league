import { createAction } from "redux-starter-kit";
import { GET_OWNER_PROFILES_HOME_SCREEN } from "./ownerProfilesActionTypes";
import { returnMongoCollection } from "../../databaseManagement";
import { sortArrayBy } from "../../utils";
