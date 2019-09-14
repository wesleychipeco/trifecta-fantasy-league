import { createAction } from "redux-starter-kit";
import {
  SAVE_CALCULATED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SET_TRIFECTA_STANDINGS_LAST_SCRAPED,
  SORT_TRIFECTA_STANDINGS_TABLE,
} from "./trifectaStandingsActionTypes";
import { format } from "date-fns";
import { returnMongoCollection } from "../../databaseManagement";

const actions = {
  saveCalculatedTrifectaStandings: createAction(
    SAVE_CALCULATED_TRIFECTA_STANDINGS
  ),
  saveExistingTrifectaStandings: createAction(SAVE_EXISTING_TRIFECTA_STANDINGS),
  setTrifectaStandingsLastScraped: createAction(
    SET_TRIFECTA_STANDINGS_LAST_SCRAPED
  ),
  sortTrifectaStandingsTable: createAction(SORT_TRIFECTA_STANDINGS_TABLE),
};

const retrieveSportStandings = (year, sport) => {
  const collection = returnMongoCollection(sport + "Standings" + year);

  const hello = collection
    .find({}, { teamName: 1, totalTrifectaPoints: 1 })
    .asArray()
    .then(docs => {
      console.log(docs);
      return docs;
    })
    .catch(err => {
      console.log("error finding sports standings", err);
    });
  console.log("hello", hello);
  return hello;
};

const calculateTrifectaStandings = (
  year,
  basketballSeasonEnded,
  baseballSeasonEnded,
  footballSeasonEnded
) => {
  return async function(dispatch) {
    if (basketballSeasonEnded) {
      const basketballStandings = await retrieveSportStandings(
        year,
        "basketball"
      );
      console.log("2nd?");
      console.log("bs", basketballStandings);
    }
    console.log("1st?");
  };
};

export { calculateTrifectaStandings };
