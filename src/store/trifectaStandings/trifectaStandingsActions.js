import { createAction } from "redux-starter-kit";
import {
  SAVE_CALCULATED_TRIFECTA_STANDINGS,
  SAVE_EXISTING_TRIFECTA_STANDINGS,
  SET_TRIFECTA_STANDINGS_LAST_SCRAPED,
  SORT_TRIFECTA_STANDINGS_TABLE,
} from "./trifectaStandingsActionTypes";
import { format } from "date-fns";
import {
  returnMongoCollection,
  deleteAndInsert,
  findAndSaveToRedux,
} from "../../databaseManagement";
import { sum, sortArrayBy } from "../../utils";
import {
  retriveOwnerIdsOwnerNamesArray,
  returnOwnerNamesArray,
} from "../../computators/addOwnerNames";

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

  const sportsStandings = collection
    .find({}, { projection: { ownerIds: 1, totalTrifectaPoints: 1 } })
    .asArray()
    .then(docs => {
      return docs;
    })
    .catch(err => {
      console.log("error finding sports standings", err);
    });
  return sportsStandings;
};

const retrieveOwnersPerTeamArray = year => {
  const teamListsCollection = returnMongoCollection("teamLists");
  const teamList = teamListsCollection
    .find({ year }, { projection: { _id: 0, year: 0 } })
    .asArray()
    .then(docs => docs[0].teams);
  return teamList;
};

const checkSameArray = (array1, array2) => {
  const arrayLengthCondition = array1.length === array2.length;
  const arrayValuesCondtion =
    JSON.stringify(array1.sort()) === JSON.stringify(array2.sort());
  if (arrayLengthCondition && arrayValuesCondtion) {
    return true;
  } else {
    return false;
  }
};

const returnSportTrifectaPoints = (sportStandings, ownersPerTeam) => {
  return sportStandings.find(sportsTeam =>
    checkSameArray(sportsTeam.ownerIds, ownersPerTeam)
  ).totalTrifectaPoints;
};

const sumTrifectaPoints = (
  ownerIdsPerTeamArray,
  ownerIdsOwnerNamesArray,
  combinedArray
) => {
  const [
    basketballStandings,
    baseballStandings,
    footballStandings,
  ] = combinedArray;

  const nullPoints = 0;
  const nullPointsDisplay = "?";

  const trifectaStandings = [];

  ownerIdsPerTeamArray.forEach(ownersPerTeam => {
    const teamTrifectaStandings = {};
    const totalTrifectaPointsArray = [];

    teamTrifectaStandings.ownerIds = ownersPerTeam;

    const ownerNames = returnOwnerNamesArray(
      ownerIdsOwnerNamesArray,
      ownersPerTeam
    );
    teamTrifectaStandings.ownerNames = ownerNames.join(", ");

    if (basketballStandings) {
      const basketballTrifectaPoints = returnSportTrifectaPoints(
        basketballStandings,
        ownersPerTeam
      );
      teamTrifectaStandings.basketballTrifectaPoints = basketballTrifectaPoints;
      totalTrifectaPointsArray.push(basketballTrifectaPoints);
    } else {
      teamTrifectaStandings.basketballTrifectaPoints = nullPointsDisplay;
      totalTrifectaPointsArray.push(nullPoints);
    }

    if (baseballStandings) {
      const baseballTrifectaPoints = returnSportTrifectaPoints(
        baseballStandings,
        ownersPerTeam
      );
      teamTrifectaStandings.baseballTrifectaPoints = baseballTrifectaPoints;
      totalTrifectaPointsArray.push(baseballTrifectaPoints);
    } else {
      teamTrifectaStandings.baseballTrifectaPoints = nullPointsDisplay;
      totalTrifectaPointsArray.push(nullPoints);
    }

    if (footballStandings) {
      const footballTrifectaPoints = returnSportTrifectaPoints(
        footballStandings,
        ownersPerTeam
      );
      teamTrifectaStandings.footballTrifectaPoints = footballTrifectaPoints;
      totalTrifectaPointsArray.push(footballTrifectaPoints);
    } else {
      teamTrifectaStandings.footballTrifectaPoints = nullPointsDisplay;
      totalTrifectaPointsArray.push(nullPoints);
    }

    teamTrifectaStandings.totalTrifectaPoints = sum(totalTrifectaPointsArray);
    trifectaStandings.push(teamTrifectaStandings);
  });

  return trifectaStandings;
};

const calculateTrifectaStandings = (
  year,
  basketballSeasonEnded,
  baseballSeasonEnded,
  footballSeasonEnded
) => {
  return async function(dispatch) {
    const trifectaSportsStandingsArray = [];

    const ownerIdsPerTeamArray = await retrieveOwnersPerTeamArray(year);
    const ownerIdsOwnerNamesArray = await retriveOwnerIdsOwnerNamesArray();

    if (basketballSeasonEnded) {
      const basketballStandings = await retrieveSportStandings(
        year,
        "basketball"
      );
      trifectaSportsStandingsArray.push(basketballStandings);
    } else {
      trifectaSportsStandingsArray.push(null);
    }

    if (baseballSeasonEnded) {
      const baseballStandings = await retrieveSportStandings(year, "baseball");
      trifectaSportsStandingsArray.push(baseballStandings);
    } else {
      trifectaSportsStandingsArray.push(null);
    }

    if (footballSeasonEnded) {
      const footballStandings = await retrieveSportStandings(year, "football");
      trifectaSportsStandingsArray.push(footballStandings);
    } else {
      trifectaSportsStandingsArray.push(null);
    }

    if (
      trifectaSportsStandingsArray.length === 3 &&
      ownerIdsPerTeamArray &&
      ownerIdsOwnerNamesArray
    ) {
      dispatch(
        actions.setTrifectaStandingsLastScraped(
          format(new Date(), "M/D/YY h:mm:ss")
        )
      );
      const trifectaStandings = sortArrayBy(
        sumTrifectaPoints(
          ownerIdsPerTeamArray,
          ownerIdsOwnerNamesArray,
          trifectaSportsStandingsArray
        ),
        "totalTrifectaPoints",
        "highToLow"
      );

      const trifectaStandingsCollection = returnMongoCollection(
        "trifectaStandings" + year
      );
      deleteAndInsert(
        dispatch,
        actions.saveCalculatedTrifectaStandings,
        trifectaStandingsCollection,
        trifectaStandings
      );
    } else {
      console.log("Error compiling trifectaStandingsSportsArray!");
    }
  };
};

const displayTrifectaStandings = year => {
  return async function(dispatch) {
    const trifectaStandingsCollection = returnMongoCollection(
      "trifectaStandings" + year
    );

    findAndSaveToRedux(
      dispatch,
      actions.saveExistingTrifectaStandings,
      trifectaStandingsCollection,
      "totalTrifectaPoints"
    );
  };
};

const sortTable = standings => {
  return async function(dispatch) {
    dispatch(actions.sortTrifectaStandingsTable(standings));
  };
};

export { calculateTrifectaStandings, displayTrifectaStandings, sortTable };
