import axios from "axios";
import { round } from "lodash";
import {
  returnMongoCollection,
  deleteInsertDispatch,
} from "../../databaseManagement";
import {
  sortArrayBy,
  sortArrayBySecondaryParameter,
  winPerCalculation,
} from "../../utils";

const determineNonFootballMatchups = async (
  year,
  sport,
  createMatchupsObject,
  createNumbersMappingObject
) => {
  let url = "";
  if (sport === "basketball") {
    url = `https://fantasy.espn.com/apis/v3/games/fba/seasons/${year}/segments/0/leagues/100660?view=mMatchupScore`;
  } else if (sport === "baseball") {
    url = `https://fantasy.espn.com/apis/v3/games/flb/seasons/${year}/segments/0/leagues/109364?view=mMatchupScore`;
  }

  const matchupsObject = createMatchupsObject(sport);
  const mappingObject = createNumbersMappingObject(sport);
  const scrapedResponse = await axios.get(url);
  const fullSchedule = scrapedResponse.data.schedule;
  const regularSeasonSchedule = fullSchedule.filter(
    (matchup) => matchup.playoffTierType === "NONE"
  );
  // console.log("regular season schedule", regularSeasonSchedule);
  for (let i = 0; i < regularSeasonSchedule.length; i++) {
    const game = regularSeasonSchedule[i];
    const homeTeamSportNumber = game.home.teamId;
    const homeTeamTrifectaNumber = mappingObject[homeTeamSportNumber];
    const {
      wins: homeTeamWins,
      losses: homeTeamLosses,
      ties: homeTeamTies,
    } = game.home.cumulativeScore;

    const awayTeamSportNumber = game.away.teamId;
    const awayTeamTrifectaNumber = mappingObject[awayTeamSportNumber];
    const {
      wins: awayTeamWins,
      losses: awayTeamLosses,
      ties: awayTeamTies,
    } = game.away.cumulativeScore;

    const homeTeamMatchups =
      matchupsObject[homeTeamTrifectaNumber].matchups[awayTeamTrifectaNumber];
    homeTeamMatchups.wins = homeTeamMatchups.wins + homeTeamWins;
    homeTeamMatchups.losses = homeTeamMatchups.losses + homeTeamLosses;
    homeTeamMatchups.ties = homeTeamMatchups.ties + homeTeamTies;
    homeTeamMatchups.winPer = winPerCalculation(
      homeTeamMatchups.wins,
      homeTeamMatchups.losses,
      homeTeamMatchups.ties
    );

    const awayTeamMatchups =
      matchupsObject[awayTeamTrifectaNumber].matchups[homeTeamTrifectaNumber];
    awayTeamMatchups.wins = awayTeamMatchups.wins + awayTeamWins;
    awayTeamMatchups.losses = awayTeamMatchups.losses + awayTeamLosses;
    awayTeamMatchups.ties = awayTeamMatchups.ties + awayTeamTies;
    awayTeamMatchups.winPer = winPerCalculation(
      awayTeamMatchups.wins,
      awayTeamMatchups.losses,
      awayTeamMatchups.ties
    );
  }
  return matchupsObject;
};

export const determineBasketballMatchups = (
  year,
  createMatchupsObject,
  createNumbersMappingObject
) => {
  return determineNonFootballMatchups(
    year,
    "basketball",
    createMatchupsObject,
    createNumbersMappingObject
  );
};

export const determineBaseballMatchups = (
  year,
  createMatchupsObject,
  createNumbersMappingObject
) => {
  return determineNonFootballMatchups(
    year,
    "baseball",
    createMatchupsObject,
    createNumbersMappingObject
  );
};

export const determineFootballMatchups = async (
  year,
  createMatchupsObject,
  createNumbersMappingObject
) => {
  const sport = "football";
  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/154802?view=mMatchupScore`;

  const matchupsObject = createMatchupsObject(sport);
  const mappingObject = createNumbersMappingObject(sport);
  const scrapedResponse = await axios.get(url);
  const fullSchedule = scrapedResponse.data.schedule;
  const regularSeasonSchedule = fullSchedule.filter(
    (matchup) => matchup.playoffTierType === "NONE"
  );
  // console.log("regular season schedule", regularSeasonSchedule);
  for (let i = 0; i < regularSeasonSchedule.length; i++) {
    const game = regularSeasonSchedule[i];
    const homeTeamSportNumber = game.home.teamId;
    const homeTeamTrifectaNumber = mappingObject[homeTeamSportNumber];
    const homeTeamPointsFor = game.home.totalPoints;

    const awayTeamSportNumber = game.away.teamId;
    const awayTeamTrifectaNumber = mappingObject[awayTeamSportNumber];
    const awayTeamPointsFor = game.away.totalPoints;

    let homeTeamWins = 0;
    let homeTeamLosses = 0;
    let homeTeamTies = 0;
    let awayTeamWins = 0;
    let awayTeamLosses = 0;
    let awayTeamTies = 0;

    // tie
    if (homeTeamPointsFor === awayTeamPointsFor) {
      homeTeamTies = 1;
      awayTeamTies = 1;
    }
    // home team wins
    else if (homeTeamPointsFor > awayTeamPointsFor) {
      homeTeamWins = 1;
      awayTeamLosses = 1;
    }
    // away team wins
    else {
      homeTeamLosses = 1;
      awayTeamWins = 1;
    }

    const homeTeamMatchups =
      matchupsObject[homeTeamTrifectaNumber].matchups[awayTeamTrifectaNumber];
    homeTeamMatchups.wins = homeTeamMatchups.wins + homeTeamWins;
    homeTeamMatchups.losses = homeTeamMatchups.losses + homeTeamLosses;
    homeTeamMatchups.ties = homeTeamMatchups.ties + homeTeamTies;
    homeTeamMatchups.winPer = winPerCalculation(
      homeTeamMatchups.wins,
      homeTeamMatchups.losses,
      homeTeamMatchups.ties
    );
    homeTeamMatchups.pointsFor = round(
      homeTeamMatchups.pointsFor + homeTeamPointsFor,
      1
    );
    homeTeamMatchups.pointsAgainst = round(
      homeTeamMatchups.pointsAgainst + awayTeamPointsFor,
      1
    );
    homeTeamMatchups.pointsDiff = round(
      homeTeamMatchups.pointsDiff + homeTeamPointsFor - awayTeamPointsFor,
      1
    );

    const awayTeamMatchups =
      matchupsObject[awayTeamTrifectaNumber].matchups[homeTeamTrifectaNumber];
    awayTeamMatchups.wins = awayTeamMatchups.wins + awayTeamWins;
    awayTeamMatchups.losses = awayTeamMatchups.losses + awayTeamLosses;
    awayTeamMatchups.ties = awayTeamMatchups.ties + awayTeamTies;
    awayTeamMatchups.winPer = winPerCalculation(
      awayTeamMatchups.wins,
      awayTeamMatchups.losses,
      awayTeamMatchups.ties
    );
    awayTeamMatchups.pointsFor = round(
      awayTeamMatchups.pointsFor + awayTeamPointsFor,
      1
    );
    awayTeamMatchups.pointsAgainst = round(
      awayTeamMatchups.pointsAgainst + homeTeamPointsFor,
      1
    );
    awayTeamMatchups.pointsDiff = round(
      awayTeamMatchups.pointsDiff + awayTeamPointsFor - homeTeamPointsFor,
      1
    );
  }
  return matchupsObject;
};

export const determineTotalMatchups = async (
  year,
  trifectaNumber,
  basketballMatchups,
  baseballMatchups,
  footballMatchups
) => {
  const eachMatchupsObject = {
    year,
    basketballMatchups: null,
    baseballMatchups: null,
    footballMatchups: null,
    totalMatchups: null,
  };

  // add each sport's matchups for this trifectaNumber, sorted
  eachMatchupsObject.basketballMatchups = sortArrayBy(
    Object.values(basketballMatchups[trifectaNumber].matchups),
    "winPer",
    true
  );
  eachMatchupsObject.baseballMatchups = sortArrayBy(
    Object.values(baseballMatchups[trifectaNumber].matchups),
    "winPer",
    true
  );
  eachMatchupsObject.footballMatchups = sortArrayBySecondaryParameter(
    Object.values(footballMatchups[trifectaNumber].matchups),
    "winPer",
    "pointsDiff"
  );

  const totalMatchups = [];
  // loop through basketball arbitrarliy to go through all opposing team's matchups
  for (const [opposingTrifectaNumber, basketball] of Object.entries(
    basketballMatchups[trifectaNumber].matchups
  )) {
    let eachTotalMatchupObject = {};
    const baseball =
      baseballMatchups[trifectaNumber].matchups[opposingTrifectaNumber];
    const football =
      footballMatchups[trifectaNumber].matchups[opposingTrifectaNumber];

    const basketballWinPer = basketball.winPer;
    const baseballWinPer = baseball.winPer;
    const footballWinPer = football.winPer;

    eachTotalMatchupObject = {
      ownerNames: basketball.ownerNames,
      basketballWinPer,
      baseballWinPer,
      footballWinPer,
      totalWinPer: round(
        (basketballWinPer + baseballWinPer + footballWinPer) / 3,
        3
      ),
    };
    // console.log("EACH matchup object", eachTotalMatchupObject);
    // console.log("============================================================");
    totalMatchups.push(eachTotalMatchupObject);
  }
  eachMatchupsObject.totalMatchups = sortArrayBy(
    totalMatchups,
    "totalWinPer",
    true
  );
  return eachMatchupsObject;
};

const findIndexOfOwnerNames = (matchupsArray, ownerNamesToMatch) => {
  // need to handle if owners are in different order in comma separated list
  return matchupsArray.findIndex((matchup) => {
    const commaIndex = matchup.ownerNames.indexOf(",");
    const rearranged =
      matchup.ownerNames.substring(commaIndex + 2) +
      ", " +
      matchup.ownerNames.substring(0, commaIndex);

    return (
      ownerNamesToMatch === matchup.ownerNames ||
      ownerNamesToMatch === rearranged
    );
  });
};

export const addToAllTimeMatchups = async (
  trifectaNumber,
  eachTotalMatchupsObject
) => {
  // connect to mongo
  const ownerMatchupsCollection = await returnMongoCollection(
    `owner${trifectaNumber}Matchups`
  );

  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++");
  // keep going for all-time practice
  const allTimeOwnerMatchupsRaw = await ownerMatchupsCollection
    .find({ year: "all" }, { projection: { _id: 0 } })
    .asArray();
  const allTimeOwnerMatchups =
    allTimeOwnerMatchupsRaw && allTimeOwnerMatchupsRaw[0];
  console.log("ALL TIME! for number", trifectaNumber, allTimeOwnerMatchups);

  const newYear = "allNew";
  // if year: 'all' does not exist, simply upload full year's matchup object
  if (!allTimeOwnerMatchups) {
    const eachMatchupsObjectCopy = {
      ...eachTotalMatchupsObject,
      year: newYear,
    };
    deleteInsertDispatch(
      null,
      null,
      ownerMatchupsCollection,
      newYear,
      eachMatchupsObjectCopy,
      null,
      false
    );
  } else {
    const eachAllTimeMatchupsUpdated = {
      basketballMatchups: [],
      baseballMatchups: [],
      footballMatchups: [],
      totalMatchups: [],
    };

    // loop through each sports matchups
    const sportsList = [
      "basketballMatchups",
      "baseballMatchups",
      "footballMatchups",
      "totalMatchups",
    ];
    for (let sportIndex = 0; sportIndex < sportsList.length; sportIndex++) {
      const listOfFoundOwnerNames = [];
      const sport = sportsList[sportIndex];
      console.log("-------------------------------------------------------");
      console.log("this year's", sport, eachTotalMatchupsObject[sport]);
      const sportMatchups = eachTotalMatchupsObject[sport];

      // for each owner in this sport's matchups object, find match within allTimeMatchups
      for (let i = 0; i < sportMatchups.length; i++) {
        const ownerNames = sportMatchups[i].ownerNames;
        listOfFoundOwnerNames.push(ownerNames);

        // create new object for each owner within this sport
        const ownerMatchupsObject = { ownerNames };

        // need to handle if owners are in different order in comma separated list
        const foundOwnerIndex = allTimeOwnerMatchups[sport].findIndex(
          (matchup) => {
            const commaIndex = matchup.ownerNames.indexOf(",");
            const rearranged =
              matchup.ownerNames.substring(commaIndex + 2) +
              ", " +
              matchup.ownerNames.substring(0, commaIndex);

            return (
              ownerNames === matchup.ownerNames || ownerNames === rearranged
            );
          }
        );

        // for total matchups, use updated matchups objects to compile totalWinPer
        if (sport === "totalMatchups") {
          const allTimeBasketball =
            eachAllTimeMatchupsUpdated["basketballMatchups"];
          const allTimeBaseball =
            eachAllTimeMatchupsUpdated["baseballMatchups"];
          const allTimeFootball =
            eachAllTimeMatchupsUpdated["footballMatchups"];
          const foundOwnerIndexBasketball = findIndexOfOwnerNames(
            allTimeBasketball,
            ownerNames
          );
          const foundOwnerIndexBaseball = findIndexOfOwnerNames(
            allTimeBaseball,
            ownerNames
          );
          const foundOwnerIndexFootball = findIndexOfOwnerNames(
            allTimeFootball,
            ownerNames
          );

          const updatedWinPerBasketball =
            allTimeBasketball[foundOwnerIndexBasketball].winPer;
          const updatedWinPerBaseball =
            allTimeBaseball[foundOwnerIndexBaseball].winPer;
          const updatedWinPerFootball =
            allTimeFootball[foundOwnerIndexFootball].winPer;
          const updatedTotalWinPer = round(
            (updatedWinPerBasketball +
              updatedWinPerBaseball +
              updatedWinPerFootball) /
              3,
            3
          );

          ownerMatchupsObject.basketballWinPer = updatedWinPerBasketball;
          ownerMatchupsObject.baseballWinPer = updatedWinPerBaseball;
          ownerMatchupsObject.footballWinPer = updatedWinPerFootball;
          ownerMatchupsObject.totalWinPer = updatedTotalWinPer;
        }
        // for non-total matchups sports
        else {
          // add this sport's matchup totals to all time
          ownerMatchupsObject.wins =
            allTimeOwnerMatchups[sport][foundOwnerIndex].wins +
            sportMatchups[i].wins;
          ownerMatchupsObject.losses =
            allTimeOwnerMatchups[sport][foundOwnerIndex].losses +
            sportMatchups[i].losses;
          ownerMatchupsObject.ties =
            allTimeOwnerMatchups[sport][foundOwnerIndex].ties +
            sportMatchups[i].ties;
          const { wins, losses, ties } = ownerMatchupsObject;
          ownerMatchupsObject.winPer = winPerCalculation(wins, losses, ties);

          if (sport === "footballMatchups") {
            ownerMatchupsObject.pointsFor = round(
              allTimeOwnerMatchups[sport][foundOwnerIndex].pointsFor +
                sportMatchups[i].pointsFor,
              1
            );
            ownerMatchupsObject.pointsAgainst = round(
              allTimeOwnerMatchups[sport][foundOwnerIndex].pointsAgainst +
                sportMatchups[i].pointsAgainst,
              1
            );
            ownerMatchupsObject.pointsDiff = round(
              ownerMatchupsObject.pointsFor - ownerMatchupsObject.pointsAgainst,
              1
            );
          }
        }

        eachAllTimeMatchupsUpdated[sport].push(ownerMatchupsObject);
      }

      // for each sport (even total matchups), need to find which owners whose matchup stats have not changed
      const copyOverOwners = allTimeOwnerMatchups[sport].filter((obj) => {
        const allTimeOwnerNames = obj.ownerNames;

        // look for name ownerNames in found list, rearranged or not
        const foundIndex = listOfFoundOwnerNames.findIndex((name) => {
          const commaIndex = name.indexOf(",");
          const rearranged =
            name.substring(commaIndex + 2) +
            ", " +
            name.substring(0, commaIndex);
          return allTimeOwnerNames === name || allTimeOwnerNames === rearranged;
        });

        return foundIndex === -1;
      });
      // straight add to sport matchups
      eachAllTimeMatchupsUpdated[sport].push(...copyOverOwners);
    }

    eachAllTimeMatchupsUpdated.year = newYear;
    console.log("FINAL ALL-TIME MATCHUPS", eachAllTimeMatchupsUpdated);
    deleteInsertDispatch(
      null,
      null,
      ownerMatchupsCollection,
      newYear,
      eachAllTimeMatchupsUpdated,
      null,
      false
    );
  }
};
