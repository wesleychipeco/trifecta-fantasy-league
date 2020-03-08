import { createAction } from "redux-starter-kit";
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
  sport
) => {
  console.log("try all", allMappedMatchupValues);
  for (const opposingOwner of sportYearMatchups) {
    const {
      ownerNames,
      wins,
      losses,
      ties,
      pointsFor,
      pointsAgainst
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
      if (sport === "footballMatchups") {
        const newPointsFor =
          pointsFor + matchedExistingOwnerMatchupValues.pointsFor;
        const newPointsAgainst =
          pointsAgainst + matchedExistingOwnerMatchupValues.pointsAgainst;
      }
      // console.log(
      //   "owner against",
      //   ownerNames,
      //   "season wins",
      //   wins,
      //   "all wins",
      //   matchedExistingOwnerMatchupValues.wins,
      //   "new wins",
      //   newWins
      // );
      // console.log(
      //   "owner against",
      //   ownerNames,
      //   "season losses",
      //   losses,
      //   "all losses",
      //   matchedExistingOwnerMatchupValues.losses,
      //   "new losses",
      //   newLosses
      // );
      // console.log(
      //   "owner against",
      //   ownerNames,
      //   "season ties",
      //   ties,
      //   "all ties",
      //   matchedExistingOwnerMatchupValues.ties,
      //   "new ties",
      //   newTies
      // );
      // TODO - calculate winning % and point diff
    } else {
      // TODO - create new object with only entry being one season
    }
  }

  // TODO - after updating old values and adding new entries for new owners comepletely,
  // return array of objects to be uploaded to mongodb
};

const totalAllMatchups = async (yearMatchups, allMatchups) => {
  const sportsMatchupsList = [
    "basketballMatchups",
    "baseballMatchups",
    "footballMatchups"
  ];
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

    await calculateTotalMatchups(
      sportYearMatchups,
      allMappedMatchupValues,
      sport
    );
  }
  return;
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
        console.log("upload ALL for team#: ", teamNumber, uploadAllMatchups);
      } else {
        console.log("owner need to compile for team#: ", teamNumber);
        const compiledAllMatchups = await totalAllMatchups(
          yearMatchups,
          allMatchups
        );
        // TODO - take array and upload to mongodb

        // TODO - create START, add to during, and FINISH dispatch events for redux
        // one start, after each owner finishes, add ownerNumber to array and save in redux
      }
    }
  };
};

export { retrieveYearMatchups };
