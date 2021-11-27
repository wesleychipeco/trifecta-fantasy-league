import axios from "axios";
import { round } from "lodash";
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
      2
    );
    homeTeamMatchups.pointsAgainst = round(
      homeTeamMatchups.pointsAgainst + awayTeamPointsFor,
      2
    );
    homeTeamMatchups.pointsDiff = round(
      homeTeamMatchups.pointsDiff + homeTeamPointsFor - awayTeamPointsFor,
      2
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
      2
    );
    awayTeamMatchups.pointsAgainst = round(
      awayTeamMatchups.pointsAgainst + homeTeamPointsFor,
      2
    );
    awayTeamMatchups.pointsDiff = round(
      awayTeamMatchups.pointsDiff + awayTeamPointsFor - homeTeamPointsFor,
      2
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
    const eachTotalMatchupObject = {};
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
