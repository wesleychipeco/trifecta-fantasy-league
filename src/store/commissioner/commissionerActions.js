import { createAction } from "redux-starter-kit";
import round from "lodash/round";
import mean from "lodash/mean";
import {
  SCRAPE_YEAR_MATCHUPS_START,
  SCRAPE_YEAR_INDIVIDUAL_MATCHUPS_SUCCESS,
  SCRAPE_YEAR_INDIVIDUAL_MATCHUPS_FAILURE,
  SCRAPE_YEAR_MATCHUPS_FINISH
} from "./commissionerActionTypes";
import {
  deleteInsertDispatch,
  returnMongoCollection,
  findFromMongoSaveToRedux
} from "../../databaseManagement";

const actions = {
  scrapeYearMatchupsStart: createAction(SCRAPE_YEAR_MATCHUPS_START),
  scrapeYearIndividualMatchupsSuccess: createAction(
    SCRAPE_YEAR_INDIVIDUAL_MATCHUPS_SUCCESS
  ),
  scrapeYearIndividualMatchupsFailure: createAction(
    SCRAPE_YEAR_INDIVIDUAL_MATCHUPS_FAILURE
  ),
  scrapeYearMatchupsFinish: createAction(SCRAPE_YEAR_MATCHUPS_FINISH)
};

const retrieveTeamsForYear = year => {
  const teamNumbersPerSportCollection = returnMongoCollection(
    "teamNumbersPerSport"
  );
  const teamsList = teamNumbersPerSportCollection
    .find({ year }, { projection: { _id: 0 } })
    .asArray()
    .then(docs => {
      return Object.keys(docs[0].teamNumbers);
    });
  return teamsList;
};

const getEachTeamYearMatchups = async (teamMatchupsCollectionName, year) => {
  const teamMatchupsCollection = returnMongoCollection(
    teamMatchupsCollectionName
  );
  return teamMatchupsCollection
    .findOne({ year }, { projection: { _id: 0 } })
    .then(docs => {
      return docs;
    });
};

const getEachTeamAllMatchups = async teamMatchupsCollectionName => {
  const teamMatchupsCollection = returnMongoCollection(
    teamMatchupsCollectionName
  );
  return teamMatchupsCollection
    .findOne({ year: "all" }, { projection: { _id: 0 } })
    .then(docs => {
      return docs;
    });
};

// create an object instead of array for each opposing owner's matchups
const getAllMappedMatchupValues = async (allMatchups, sport) => {
  const matchups = allMatchups[sport];
  const matchupsMapped = {};

  // Loop through array of each opposing owner
  for (const opposingOwner of matchups) {
    const {
      ownerNames,
      wins,
      losses,
      ties,
      pointsFor,
      pointsAgainst
    } = opposingOwner;
    matchupsMapped[ownerNames] = {
      wins,
      losses,
      ties,
      pointsFor,
      pointsAgainst
    };
  }
  return matchupsMapped;
};

const calculateUpdatedAllMatchups = (
  sportYearMatchups,
  allMappedMatchupValues,
  allSportMatchups,
  sport
) => {
  const allUpdatedMatchups = [];

  // Loop through each opposing owner of that sport's matchup results
  for (const opposingOwner of sportYearMatchups) {
    let uploadObject;
    const {
      ownerNames,
      wins,
      losses,
      ties,
      winPer,
      pointsFor,
      pointsAgainst,
      pointsDiff
    } = opposingOwner;

    const matchedExistingOwnerMatchupValues =
      allMappedMatchupValues[ownerNames];

    // success if ALL matchups has a match of this owner from current season in it
    if (matchedExistingOwnerMatchupValues) {
      // Add this season's wins/losses... to matchued existing ALL matchup wins/losses...
      const newWins = wins + matchedExistingOwnerMatchupValues.wins;
      const newLosses = losses + matchedExistingOwnerMatchupValues.losses;
      const newTies = ties + matchedExistingOwnerMatchupValues.ties;
      const newWinPer =
        (newWins + newTies / 2) / (newWins + newLosses + newTies);

      uploadObject = {
        ownerNames,
        wins: newWins,
        losses: newLosses,
        ties: newTies,
        winPer: round(newWinPer, 3)
      };

      if (sport === "footballMatchups") {
        const newPointsFor =
          pointsFor + matchedExistingOwnerMatchupValues.pointsFor;
        const newPointsAgainst =
          pointsAgainst + matchedExistingOwnerMatchupValues.pointsAgainst;
        const newPointsDiff = newPointsFor - newPointsAgainst;

        uploadObject.pointsFor = newPointsFor;
        uploadObject.pointsAgainst = newPointsAgainst;
        uploadObject.pointsDiff = round(newPointsDiff, 1);
      }
    }
    // If no match, no existing ALL matchups for this opposing owner, just this season's values
    else {
      uploadObject = {
        ownerNames,
        wins,
        losses,
        ties,
        winPer
      };

      if (sport === "footballMatchups") {
        uploadObject.pointsFor = pointsFor;
        uploadObject.pointsAgainst = pointsAgainst;
        uploadObject.pointsDiff = pointsDiff;
      }
    }

    // add each opposing owner's matchups object to array
    allUpdatedMatchups.push(uploadObject);
  }

  // once done doing all owners from that year and sport, need to do old owners who have data
  // ex: 2019 does not include "Nick Wang", thus need to add in previous data for "Nick Wang"
  const allNewMappedOwnerNames = allUpdatedMatchups.map(
    allOwner => allOwner.ownerNames
  );
  const missingOldOwners = allSportMatchups.filter(
    oldOwner => !allNewMappedOwnerNames.includes(oldOwner.ownerNames)
  );

  return [...allUpdatedMatchups, ...missingOldOwners];
};

const totalAllMatchups = async (yearMatchups, allMatchups) => {
  const sportsMatchupsList = [
    "basketballMatchups",
    "baseballMatchups",
    "footballMatchups"
  ];
  const uploadObject = { year: "all" };

  // Loop through all sports
  for (const sport of sportsMatchupsList) {
    // Keep sport-year matchups an array to loop through
    const sportYearMatchups = yearMatchups[sport];

    // Return an object for owner-to-owner mapping
    const allMappedMatchupValues = await getAllMappedMatchupValues(
      allMatchups,
      sport
    );

    // Return an array of each sport's Total compiled matchups
    const sportAllUpdatedMatchups = await calculateUpdatedAllMatchups(
      sportYearMatchups,
      allMappedMatchupValues,
      allMatchups[sport],
      sport
    );

    uploadObject[sport] = sportAllUpdatedMatchups;
  }

  // Calculate ALL totalMatchups array
  const totalMatchups = await calculateTotalMatchups(uploadObject);

  uploadObject.totalAllMatchups = totalMatchups;
  return uploadObject;
};

const calculateTotalMatchups = async matchupsObject => {
  const totalMatchups = [];
  const {
    basketballMatchups,
    baseballMatchups,
    footballMatchups
  } = matchupsObject;

  // Loop through each owner in basketballMatchups (should be same owners for each sport/total now)
  for (const basketballMatchup of basketballMatchups) {
    const opposingOwnerNames = basketballMatchup.ownerNames;

    const basketballWinPer = basketballMatchup.winPer;

    const baseballOpposingOwner = baseballMatchups.filter(opposingOwner => {
      return opposingOwner.ownerNames === opposingOwnerNames;
    });
    const baseballWinPer = baseballOpposingOwner[0].winPer;

    const footballOpposingOwner = footballMatchups.filter(
      opposingOwner => opposingOwner.ownerNames === opposingOwnerNames
    );
    const footballWinPer = footballOpposingOwner[0].winPer;

    const totalWinPer = round(
      mean([basketballWinPer, baseballWinPer, footballWinPer]),
      3
    );

    const totalMatchupsObject = {
      ownerNames: opposingOwnerNames,
      basketballWinPer,
      baseballWinPer,
      footballWinPer,
      totalWinPer
    };
    totalMatchups.push(totalMatchupsObject);
  }
  return totalMatchups;
};

const uploadDocuments = async (teamNumber, matchupsObject, dispatch) => {
  const objectKeys = Object.keys(matchupsObject);
  const includeKeysBoolean =
    objectKeys.includes("year") &&
    objectKeys.includes("basketballMatchups") &&
    objectKeys.includes("baseballMatchups") &&
    objectKeys.includes("footballMatchups");

  if (includeKeysBoolean) {
    const includesArrayLengthBoolean =
      matchupsObject.basketballMatchups.length >= 9 &&
      matchupsObject.baseballMatchups.length >= 9 &&
      matchupsObject.footballMatchups.length >= 9;

    if (includesArrayLengthBoolean) {
      dispatch(actions.scrapeYearIndividualMatchupsSuccess(teamNumber));
      return matchupsObject;
    }
  }
  dispatch(actions.scrapeYearIndividualMatchupsFailure(teamNumber));
  return matchupsObject;
};

const scrapeYearAllMatchups = year => {
  return async function(dispatch) {
    dispatch(actions.scrapeYearMatchupsStart);
    const teamsList = await retrieveTeamsForYear(year);

    // Loop through all teams for requested year
    for (const teamNumber of teamsList) {
      let uploadAllMatchups;
      const teamMatchupsCollectionName = `owner${teamNumber}Matchups`;

      // Get that year's matchups per team
      const yearMatchups = await getEachTeamYearMatchups(
        teamMatchupsCollectionName,
        year
      );
      // Get all-time matchups per team
      const allMatchups = await getEachTeamAllMatchups(
        teamMatchupsCollectionName
      );

      // If no "all" matchups exists, first season in existence and one season becomes "all"
      if (!allMatchups) {
        const {
          totalMatchups,
          basketballMatchups,
          baseballMatchups,
          footballMatchups
        } = yearMatchups;
        uploadAllMatchups = {
          year: "all",
          totalMatchups,
          basketballMatchups,
          baseballMatchups,
          footballMatchups
        };
      } else {
        uploadAllMatchups = await totalAllMatchups(yearMatchups, allMatchups);
      }

      const finalUpload = await uploadDocuments(
        teamNumber,
        uploadAllMatchups,
        dispatch
      );
      console.log("FINAL - Team Number", teamNumber, finalUpload);
      // TODO - take array and upload to mongodb
    }

    dispatch(actions.scrapeYearMatchupsFinish);
  };
};

export { scrapeYearAllMatchups };
