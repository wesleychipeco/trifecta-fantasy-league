import { createAction } from "redux-starter-kit";
import round from "lodash/round";
import mean from "lodash/mean";
import { SCRAPE_YEAR_MATCHUPS } from "./commissionerActionTypes";
import {
  deleteInsertDispatch,
  returnMongoCollection,
  findFromMongoSaveToRedux
} from "../../databaseManagement";

const actions = {
  scrapeYearMatchups: createAction(SCRAPE_YEAR_MATCHUPS)
};

const retrieveTeamsInYear = year => {
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

const getAllMappedMatchupValues = async (allMatchups, sport) => {
  const matchups = allMatchups[sport];
  const matchupsMapped = {};
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

const calculateTotalMatchups = (
  sportYearMatchups,
  allMappedMatchupValues,
  allSportMatchups,
  sport
) => {
  const allUpdatedMatchups = [];
  console.log("try all", allMappedMatchupValues);
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
    console.log("try owner", ownerNames);
    console.log("try map", allMappedMatchupValues[ownerNames]);
    const matchedExistingOwnerMatchupValues =
      allMappedMatchupValues[ownerNames];
    // success if all matchups has a match of this owner from current season in it
    if (matchedExistingOwnerMatchupValues) {
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

      console.log("upload object", uploadObject);
    } else {
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

      console.log("upload object", uploadObject);
    }

    allUpdatedMatchups.push(uploadObject);
  }

  // once done doing all owners from that year and sport, need to do old owners who have data
  // ex: 2019 does not include "Nick Wang", thus need to add in previous data for "Nick Wang"
  const allNewMappedOwnerNames = allUpdatedMatchups.map(
    allOwner => allOwner.ownerNames
  );
  console.log("aaaaaaaaaaaaaaaa", allSportMatchups);
  const missingOldOwners = allSportMatchups.filter(
    oldOwner => !allNewMappedOwnerNames.includes(oldOwner.ownerNames)
  );
  console.log("missing old owners", missingOldOwners);
  console.log("wesley james", [...allUpdatedMatchups, ...missingOldOwners]);
  return [...allUpdatedMatchups, ...missingOldOwners];
};

const totalAllMatchups = async (yearMatchups, allMatchups) => {
  const sportsMatchupsList = [
    "basketballMatchups",
    "baseballMatchups",
    "footballMatchups"
  ];
  const uploadObject = { year: "all" };

  for (const sport of sportsMatchupsList) {
    console.log("owner totaling sport...", sport);
    // Keep sport-year matchups an array to loop through
    const sportYearMatchups = yearMatchups[sport];
    console.log(sport, "YEAR matchups", sportYearMatchups);

    // Put ALL matchups in an object to map to
    const allMappedMatchupValues = await getAllMappedMatchupValues(
      allMatchups,
      sport
    );
    console.log(sport, "ALL mapped matchups ", allMappedMatchupValues);

    const sportAllUpdatedMatchups = await calculateTotalMatchups(
      sportYearMatchups,
      allMappedMatchupValues,
      allMatchups[sport],
      sport
    );

    uploadObject[sport] = sportAllUpdatedMatchups;
  }

  const totalMatchups = [];
  const {
    basketballMatchups,
    baseballMatchups,
    footballMatchups
  } = uploadObject;

  console.log("eeeeeeeeeeeeeeeee", basketballMatchups);
  for (const basketballMatchup of basketballMatchups) {
    console.log("ooooooo", basketballMatchup);
    const opposingOwnerNames = basketballMatchup.ownerNames;
    console.log("hello hockey", opposingOwnerNames);
    const basketballWinPer = basketballMatchup.winPer;

    const baseballOpposingOwner = baseballMatchups.filter(opposingOwner => {
      console.log("bbaseball", opposingOwner);
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
  uploadObject.totalAllMatchups = totalMatchups;
  return uploadObject;
};

const retrieveYearMatchups = year => {
  return async function(dispatch) {
    const teamsList = await retrieveTeamsInYear(year);

    for (const teamNumber of teamsList) {
      const teamMatchupsCollectionName = `owner${teamNumber}Matchups`;
      // Get that year's matchups
      const yearMatchups = await getEachTeamYearMatchups(
        teamMatchupsCollectionName,
        year
      );
      // Get all-time matchups
      const allMatchups = await getEachTeamAllMatchups(
        teamMatchupsCollectionName
      );
      // console.log("teamnumber", teamNumber);
      // console.log("year", yearMatchups);
      // console.log("all", allMatchups);

      // If no "all" matchups exists, firsts season and one season becomes all
      if (!allMatchups) {
        const {
          totalMatchups,
          basketballMatchups,
          baseballMatchups,
          footballMatchups
        } = yearMatchups;
        const uploadAllMatchups = {
          year: "all",
          totalMatchups,
          basketballMatchups,
          baseballMatchups,
          footballMatchups
        };
        console.log(
          "FINAL - upload ALL for team#: ",
          teamNumber,
          uploadAllMatchups
        );
      } else {
        console.log("owner need to compile for team#: ", teamNumber);
        const compiledAllMatchups = await totalAllMatchups(
          yearMatchups,
          allMatchups
        );
        console.log(
          "FINAL - upload ALL for team#: ",
          teamNumber,
          compiledAllMatchups
        );

        // TODO - take array and upload to mongodb

        // TODO - create START, add to during, and FINISH dispatch events for redux
        // one start, after each owner finishes, add ownerNumber to array and save in redux
      }
    }
  };
};

export { retrieveYearMatchups };
