import { createAction } from "redux-starter-kit";
import {
  SAVE_SCRAPED_BASKETBALL_MATCHUPS,
  SAVE_SCRAPED_BASEBALL_MATCHUPS,
  SAVE_SCRAPED_FOOTBALL_MATCHUPS,
  SAVE_SCRAPED_TOTAL_MATCHUPS,
  SAVE_EXISTING_TOTAL_MATCHUPS,
  SAVE_EXISTING_BASKETBALL_MATCHUPS,
  SAVE_EXISTING_BASEBALL_MATCHUPS,
  SAVE_EXISTING_FOOTBALL_MATCHUPS,
  SORT_MATCHUPS,
  SET_MATCHUPS_LAST_SCRAPED,
} from "./matchupsActionTypes";
import {
  returnMongoCollection,
  findFromMongoSaveToRedux,
  deleteInsertDispatch,
} from "../../databaseManagement";
import {
  retrieveSportMatchups,
  retrieveFootballPoints,
} from "../../scrapers/ownerMatchups";
import { basketballMatchups2019 } from "../../dataJSONS/basketballMatchups2019";
import { format } from "date-fns";
import { sortArrayBy, sortArrayBySecondaryParameter } from "../../utils";
import round from "lodash/round";
import mean from "lodash/mean";
import {
  determineBaseballMatchups,
  determineBasketballMatchups,
  determineFootballMatchups,
  determineTotalMatchups,
} from "./calculateSportMatchups";

const actions = {
  saveScrapedTotalMatchups: createAction(SAVE_SCRAPED_TOTAL_MATCHUPS),
  saveScrapedBasketballMatchups: createAction(SAVE_SCRAPED_BASKETBALL_MATCHUPS),
  saveScrapedBaseballMatchups: createAction(SAVE_SCRAPED_BASEBALL_MATCHUPS),
  saveScrapedFootballMatchups: createAction(SAVE_SCRAPED_FOOTBALL_MATCHUPS),
  saveExistingTotalMatchups: createAction(SAVE_EXISTING_TOTAL_MATCHUPS),
  saveExistingBasketballMatchups: createAction(
    SAVE_EXISTING_BASKETBALL_MATCHUPS
  ),
  saveExistingBaseballMatchups: createAction(SAVE_EXISTING_BASEBALL_MATCHUPS),
  saveExistingFootballMatchups: createAction(SAVE_EXISTING_FOOTBALL_MATCHUPS),
  sortMatchups: createAction(SORT_MATCHUPS),
  setLastScraped: createAction(SET_MATCHUPS_LAST_SCRAPED),
};

const scrapeMatchups = (
  year
  // basketballSeasonEnded,
  // basketballTeamNumber,
  // basketballTeams,
  // baseballSeasonEnded,
  // baseballTeamNumber,
  // baseballTeams,
  // footballSeasonEnded,
  // footballTeamNumber,
  // footballTeams
) => {
  return async function (dispatch) {
    dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:mm:")));
    // connect to mongo
    const seasonVariablesCollection = await returnMongoCollection(
      "seasonVariables"
    );
    const seasonVars = await seasonVariablesCollection
      .find({}, { projection: { _id: 0 } })
      .asArray()[0];

    const teamNumbersOwnerNamesCollection = returnMongoCollection(
      "ownersTeamNumbersList"
    );
    const teamNumbersOwnerNamesRaw = await teamNumbersOwnerNamesCollection
      .find({})
      .asArray();
    const teamNumbersOwnerNames = teamNumbersOwnerNamesRaw[0];

    const teamNumbersPerSportCollection = returnMongoCollection(
      "teamNumbersPerSport"
    );
    const teamNumbersPerSportRaw = await teamNumbersPerSportCollection
      .find({ year }, { projection: { id: 0, year: 0 } })
      .asArray();
    const teamNumbersPerSport = teamNumbersPerSportRaw[0];

    const trifectaNumbersList = Object.keys(teamNumbersPerSport.teamNumbers);

    // creates each sport's base matchups object
    const createSportMatchupsObject = (sport) => {
      const sportMatchupObject = {};
      const defaultMatchupsData =
        sport === "football"
          ? {
              wins: 0,
              losses: 0,
              ties: 0,
              winPer: 0,
              pointsFor: 0,
              pointsAgainst: 0,
              pointsDiff: 0,
            }
          : {
              wins: 0,
              losses: 0,
              ties: 0,
              winPer: 0,
            };

      // outer loop to add ownernames and matchups object per trifecta number
      for (let i = 0; i < trifectaNumbersList.length; i++) {
        const ownerNumber = trifectaNumbersList[i];
        sportMatchupObject[ownerNumber] = {
          ownerNames: teamNumbersOwnerNames[ownerNumber].ownerNames,
          matchups: {},
        };
        // inner loop for each other trifecta number adding default matchups data
        for (let j = 0; j < trifectaNumbersList.length; j++) {
          if (i != j) {
            const innerOwnerNumber = trifectaNumbersList[j];
            sportMatchupObject[ownerNumber].matchups[innerOwnerNumber] = {
              ...defaultMatchupsData,
              ownerNames: teamNumbersOwnerNames[innerOwnerNumber].ownerNames,
            };
          }
        }
      }
      return sportMatchupObject;
    };

    // creates sport to trifecta numbers mapping object
    const createSportNumbersMappingObject = (sport) => {
      const sportNumbersMappingObject = {};
      for (let i = 0; i < trifectaNumbersList.length; i++) {
        const trifectaNumber = trifectaNumbersList[i];
        const sportTeamNumber =
          teamNumbersPerSport.teamNumbers[trifectaNumber][sport];
        sportNumbersMappingObject[sportTeamNumber] = trifectaNumber;
      }
      return sportNumbersMappingObject;
    };

    const basketball = await determineBasketballMatchups(
      year,
      createSportMatchupsObject,
      createSportNumbersMappingObject
    );

    const baseball = await determineBaseballMatchups(
      year,
      createSportMatchupsObject,
      createSportNumbersMappingObject
    );

    const football = await determineFootballMatchups(
      year,
      createSportMatchupsObject,
      createSportNumbersMappingObject
    );

    const allTrifectaMatchupsObject = {
      basketball,
      baseball,
      football,
    };
    console.log("master trifecta matchups object", allTrifectaMatchupsObject);

    // loop through all trifecta numbers and make each owner's own matchups object and upload to that owner's mongodb
    for (let x = 0; x < trifectaNumbersList.length; x++) {
      const trifectaNumber = trifectaNumbersList[x];
      const eachTotalMatchupsObject = await determineTotalMatchups(
        year,
        trifectaNumber,
        basketball,
        baseball,
        football
      );
      console.log(
        `each total matchups object for trifecta owner number: ${trifectaNumber}!!`,
        eachTotalMatchupsObject
      );

      // connect to mongo
      const ownerMatchupsCollection = await returnMongoCollection(
        `owner${trifectaNumber}Matchups`
      );
      deleteInsertDispatch(
        null,
        null,
        ownerMatchupsCollection,
        year,
        eachTotalMatchupsObject,
        null,
        false
      );
    }
    return;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //   console.log('ttttttt', {
    //     teamNumber,
    //     basketballSeasonEnded,
    //     basketballTeamNumber,
    //     basketballTeams,
    //     baseballSeasonEnded,
    //     baseballTeamNumber,
    //     baseballTeams,
    //     footballSeasonEnded,
    //     footballTeamNumber,
    //     footballTeams
    //   });

    //   let rawBasketballMatchups;
    //   if (year === "2019") {
    //     rawBasketballMatchups = basketballTeamNumber;
    //   } else {
    //     rawBasketballMatchups = basketballSeasonEnded
    //       ? await retrieveSportMatchups("basketball", year, basketballTeamNumber)
    //       : undefined;
    //   }
    //   const basketballMatchups = await compileMatchups(
    //     rawBasketballMatchups,
    //     basketballTeams,
    //     "basketball"
    //   );
    //   console.log('BM', basketballMatchups)

    //   const rawBaseballMatchups = baseballSeasonEnded
    //     ? await retrieveSportMatchups("baseball", year, baseballTeamNumber)
    //     : undefined;
    //   const baseballMatchups = await compileMatchups(
    //     rawBaseballMatchups,
    //     baseballTeams,
    //     "baseball"
    //   );

    //   // const rawFootballMatchups = true
    //   const rawFootballMatchups = footballSeasonEnded
    //     ? await retrieveSportMatchups("football", year, footballTeamNumber)
    //     : undefined;

    //   let footballSchedule;
    //   // If rawFootballMatchups exist then need extra step of pulling schedule and adding points
    //   if (rawFootballMatchups) {
    //     footballSchedule = await retrieveFootballPoints(year);
    //   }
    //   const refinedFootballMatchups = rawFootballMatchups
    //     ? await addFootballPoints(
    //         rawFootballMatchups,
    //         footballSchedule,
    //         footballTeamNumber
    //       )
    //     : rawFootballMatchups;
    //   const footballMatchups = await compileMatchups(
    //     refinedFootballMatchups,
    //     footballTeams,
    //     "football"
    //   );

    //   const shouldCompileTotalMatchups =
    //     basketballMatchups.length > 0 &&
    //     baseballMatchups.length > 0 &&
    //     footballMatchups.length > 0;
    //   const totalMatchups = shouldCompileTotalMatchups
    //     ? await compileTotalMatchups(
    //         basketballMatchups,
    //         baseballMatchups,
    //         footballMatchups
    //       )
    //     : [];

    //   // connect to mongo
    //   const ownerMatchupsCollection = await returnMongoCollection(
    //     `owner${teamNumber}Matchups`
    //   );

    //   const compiledMatchups = {
    //     year,
    //     totalMatchups,
    //     basketballMatchups,
    //     baseballMatchups,
    //     footballMatchups,
    //   };

    //   dispatch(
    //     actions.saveScrapedBasketballMatchups(
    //       sortArrayBy(basketballMatchups, "winPer", true)
    //     )
    //   );
    //   dispatch(
    //     actions.saveScrapedBaseballMatchups(
    //       sortArrayBy(baseballMatchups, "winPer", true)
    //     )
    //   );
    //   dispatch(
    //     actions.saveScrapedFootballMatchups(
    //       sortArrayBySecondaryParameter(footballMatchups, "winPer", "pointsDiff")
    //     )
    //   );
    //   dispatch(
    //     actions.saveScrapedTotalMatchups(
    //       sortArrayBy(totalMatchups, "totalWinPer", true)
    //     )
    //   );

    //   deleteInsertDispatch(
    //     null,
    //     null,
    //     ownerMatchupsCollection,
    //     year,
    //     compiledMatchups,
    //     null,
    //     false
    //   );
  };
};

// const scrapeMatchups = (
//   year,
//   teamNumber,
//   basketballSeasonEnded,
//   basketballTeamNumber,
//   basketballTeams,
//   baseballSeasonEnded,
//   baseballTeamNumber,
//   baseballTeams,
//   footballSeasonEnded,
//   footballTeamNumber,
//   footballTeams
// ) => {
//   return async function (dispatch) {
//     dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:mm:")));
//     console.log('ttttttt', {
//       teamNumber,
//       basketballSeasonEnded,
//       basketballTeamNumber,
//       basketballTeams,
//       baseballSeasonEnded,
//       baseballTeamNumber,
//       baseballTeams,
//       footballSeasonEnded,
//       footballTeamNumber,
//       footballTeams
//     });

//     let rawBasketballMatchups;
//     if (year === "2019") {
//       rawBasketballMatchups = basketballTeamNumber;
//     } else {
//       rawBasketballMatchups = basketballSeasonEnded
//         ? await retrieveSportMatchups("basketball", year, basketballTeamNumber)
//         : undefined;
//     }
//     const basketballMatchups = await compileMatchups(
//       rawBasketballMatchups,
//       basketballTeams,
//       "basketball"
//     );
//     console.log('BM', basketballMatchups)
//     return;

//     const rawBaseballMatchups = baseballSeasonEnded
//       ? await retrieveSportMatchups("baseball", year, baseballTeamNumber)
//       : undefined;
//     const baseballMatchups = await compileMatchups(
//       rawBaseballMatchups,
//       baseballTeams,
//       "baseball"
//     );

//     // const rawFootballMatchups = true
//     const rawFootballMatchups = footballSeasonEnded
//       ? await retrieveSportMatchups("football", year, footballTeamNumber)
//       : undefined;

//     let footballSchedule;
//     // If rawFootballMatchups exist then need extra step of pulling schedule and adding points
//     if (rawFootballMatchups) {
//       footballSchedule = await retrieveFootballPoints(year);
//     }
//     const refinedFootballMatchups = rawFootballMatchups
//       ? await addFootballPoints(
//           rawFootballMatchups,
//           footballSchedule,
//           footballTeamNumber
//         )
//       : rawFootballMatchups;
//     const footballMatchups = await compileMatchups(
//       refinedFootballMatchups,
//       footballTeams,
//       "football"
//     );

//     const shouldCompileTotalMatchups =
//       basketballMatchups.length > 0 &&
//       baseballMatchups.length > 0 &&
//       footballMatchups.length > 0;
//     const totalMatchups = shouldCompileTotalMatchups
//       ? await compileTotalMatchups(
//           basketballMatchups,
//           baseballMatchups,
//           footballMatchups
//         )
//       : [];

//     // connect to mongo
//     const ownerMatchupsCollection = await returnMongoCollection(
//       `owner${teamNumber}Matchups`
//     );

//     const compiledMatchups = {
//       year,
//       totalMatchups,
//       basketballMatchups,
//       baseballMatchups,
//       footballMatchups,
//     };

//     dispatch(
//       actions.saveScrapedBasketballMatchups(
//         sortArrayBy(basketballMatchups, "winPer", true)
//       )
//     );
//     dispatch(
//       actions.saveScrapedBaseballMatchups(
//         sortArrayBy(baseballMatchups, "winPer", true)
//       )
//     );
//     dispatch(
//       actions.saveScrapedFootballMatchups(
//         sortArrayBySecondaryParameter(footballMatchups, "winPer", "pointsDiff")
//       )
//     );
//     dispatch(
//       actions.saveScrapedTotalMatchups(
//         sortArrayBy(totalMatchups, "totalWinPer", true)
//       )
//     );

//     deleteInsertDispatch(
//       null,
//       null,
//       ownerMatchupsCollection,
//       year,
//       compiledMatchups,
//       null,
//       false
//     );
//   };
// };

const addFootballPoints = (footballMatchups, fullScheduleArray, teamNumber) => {
  // loop through each "week" (ie group of 5 matchups)
  fullScheduleArray.forEach((week) => {
    let myTeamPointsFor = 0;
    let opposingTeamId = "";
    let opposingTeamPointsAgainst = 0;

    // Loop through each matchup (5 in total), only return one that has desired team in it
    const matchedMatchup = week.filter((matchup) => {
      const home = matchup.home.teamId.toString();
      const away = matchup.away.teamId.toString();
      return teamNumber === home || teamNumber === away;
    });

    const { home, away } = matchedMatchup[0];
    const homeTeam = home.teamId.toString();
    const awayTeam = away.teamId.toString();

    // If desired team is found, assign appropriate pointsFor and pointsAgainst and teamId
    if (teamNumber === homeTeam) {
      myTeamPointsFor = round(home.totalPoints, 1);
      opposingTeamId = away.teamId.toString();
      opposingTeamPointsAgainst = round(away.totalPoints, 1);
    } else if (teamNumber === awayTeam) {
      myTeamPointsFor = round(away.totalPoints, 1);
      opposingTeamId = home.teamId.toString();
      opposingTeamPointsAgainst = round(home.totalPoints, 1);
    }

    // add to h2h json only if there was a match, otherwise keep moving on
    if (opposingTeamPointsAgainst !== 0) {
      footballMatchups[opposingTeamId].pointsFor += myTeamPointsFor;
      footballMatchups[opposingTeamId].pointsAgainst +=
        opposingTeamPointsAgainst;
    }
  });
  return footballMatchups;
};

const compileMatchups = (matchups, teamsList, sport) => {
  let matchupsArray = [];
  if (matchups) {
    if (sport === "football") {
      for (let opposingTeams in matchups) {
        const { ownerNames } = teamsList[opposingTeams];
        const { wins, losses, ties, pointsFor, pointsAgainst, percentage } =
          matchups[opposingTeams];
        const ownerMatchups = {
          ownerNames,
          wins,
          losses,
          ties,
          pointsFor: round(pointsFor, 1),
          pointsAgainst: round(pointsAgainst, 1),
          pointsDiff: round(pointsFor - pointsAgainst, 1),
          winPer: round(percentage, 3),
        };
        matchupsArray.push(ownerMatchups);
      }
    } else {
      // if "2019" basketball, pull matchups from object
      if (typeof matchups === "string") {
        const basketballTeamNumber = matchups;
        matchupsArray = basketballMatchups2019[basketballTeamNumber];
      }
      // Non-2019 basketball or baseball
      else {
        for (let opposingTeams in matchups) {
          const { ownerNames } = teamsList[opposingTeams];
          const { wins, losses, ties } = matchups[opposingTeams];
          const winPer = round(matchups[opposingTeams].percentage, 3);
          const ownerMatchups = {
            ownerNames,
            wins,
            losses,
            ties,
            winPer,
          };
          matchupsArray.push(ownerMatchups);
        }
      }
    }
  }
  // if no matchups, sport is not finished yet, just return empty array
  return matchupsArray;
};

const compileTotalMatchups = (
  basketballMatchups,
  baseballMatchups,
  footballMatchups
) => {
  const totalMatchups = [];
  // loop through each opposing owner
  basketballMatchups.forEach((basketballOpposingOwner) => {
    const opposingOwnerNames = basketballOpposingOwner.ownerNames;
    const basketballWinPer = basketballOpposingOwner.winPer;

    const baseballOpposingOwner = baseballMatchups.filter(
      (opposingOwner) => opposingOwnerNames === opposingOwner.ownerNames
    );
    const baseballWinPer = baseballOpposingOwner[0].winPer;

    const footballOpposingOwner = footballMatchups.filter(
      (opposingOwner) => opposingOwnerNames === opposingOwner.ownerNames
    );
    const footballWinPer = footballOpposingOwner[0].winPer;

    const totalWinPer = round(
      mean([basketballWinPer, baseballWinPer, footballWinPer]),
      3
    );

    const matchupJson = {
      ownerNames: opposingOwnerNames,
      basketballWinPer,
      baseballWinPer,
      footballWinPer,
      totalWinPer,
    };
    totalMatchups.push(matchupJson);
  });
  return totalMatchups;
};

const displayMatchups = (year, teamNumber) => {
  return async function (dispatch) {
    //connect to mongo
    const ownerCollection = await returnMongoCollection(
      `owner${teamNumber}Matchups`
    );

    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingTotalMatchups,
      ownerCollection,
      year,
      "totalWinPer",
      "totalMatchups"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingBasketballMatchups,
      ownerCollection,
      year,
      "winPer",
      "basketballMatchups"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingBaseballMatchups,
      ownerCollection,
      year,
      "winPer",
      "baseballMatchups"
    );
    findFromMongoSaveToRedux(
      dispatch,
      actions.saveExistingFootballMatchups,
      ownerCollection,
      year,
      "winPer",
      "footballMatchups"
    );
  };
};

const sortTable = (matchups) => {
  return async function (dispatch) {
    dispatch(actions.sortMatchups(matchups));
  };
};

export { scrapeMatchups, displayMatchups, sortTable };
