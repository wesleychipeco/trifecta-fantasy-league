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
  SET_MATCHUPS_LAST_SCRAPED
} from "./matchupsActionTypes";
import {
  returnMongoCollection,
  findFromMongoSaveToRedux,
  deleteInsertDispatch
} from "../../databaseManagement";
import {
  retrieveSportMatchups,
  retrieveFootballPoints
} from "../../scrapers/ownerMatchups";
import { basketballMatchups2019 } from "../../dataJSONS/basketballMatchups2019";
import { format } from "date-fns";
import { sortArrayBy, sortArrayBySecondaryParameter } from "../../utils";
import round from "lodash/round";

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
  setLastScraped: createAction(SET_MATCHUPS_LAST_SCRAPED)
};

const scrapeMatchups = (
  year,
  teamNumber,
  basketballSeasonEnded,
  basketballTeamNumber,
  basketballTeams,
  baseballSeasonEnded,
  baseballTeamNumber,
  baseballTeams,
  footballSeasonEnded,
  footballTeamNumber,
  footballTeams
) => {
  return async function(dispatch) {
    dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:mm:")));

    let rawBasketballMatchups;
    if (year === "2019") {
      rawBasketballMatchups = basketballTeamNumber;
    } else {
      rawBasketballMatchups = basketballSeasonEnded
        ? await retrieveSportMatchups("basketball", year, basketballTeamNumber)
        : undefined;
    }
    const basketballMatchups = await compileMatchups(
      rawBasketballMatchups,
      basketballTeams,
      "basketball"
    );

    const rawBaseballMatchups = baseballSeasonEnded
      ? await retrieveSportMatchups("baseball", year, baseballTeamNumber)
      : undefined;
    const baseballMatchups = await compileMatchups(
      rawBaseballMatchups,
      baseballTeams,
      "baseball"
    );

    // const rawFootballMatchups = true
    const rawFootballMatchups = footballSeasonEnded
      ? await retrieveSportMatchups("football", year, footballTeamNumber)
      : undefined;

    let footballSchedule;
    // If rawFootballMatchups exist then need extra step of pulling schedule and adding points
    if (rawFootballMatchups) {
      footballSchedule = await retrieveFootballPoints(year);
    }
    const refinedFootballMatchups = rawFootballMatchups
      ? await addFootballPoints(
          rawFootballMatchups,
          footballSchedule,
          footballTeamNumber
        )
      : rawFootballMatchups;
    const footballMatchups = await compileMatchups(
      refinedFootballMatchups,
      footballTeams,
      "football"
    );

    const compileTotalMatchups =
      basketballMatchups.length > 0 &&
      baseballMatchups.length > 0 &&
      footballMatchups.length > 0;
    const totalMatchups = compileTotalMatchups ? ["placeholder!"] : [];

    // connect to mongo
    const ownerMatchupsCollection = returnMongoCollection(
      `owner${teamNumber}Matchups`
    );

    const compiledMatchups = {
      year,
      totalMatchups,
      basketballMatchups,
      baseballMatchups,
      footballMatchups
    };

    dispatch(
      actions.saveScrapedBasketballMatchups(
        sortArrayBy(basketballMatchups, "winPer", true)
      )
    );
    dispatch(
      actions.saveScrapedBaseballMatchups(
        sortArrayBy(baseballMatchups, "winPer", true)
      )
    );
    dispatch(
      actions.saveScrapedFootballMatchups(
        sortArrayBySecondaryParameter(footballMatchups, "winPer", "pointsDiff")
      )
    );
    dispatch(
      actions.saveScrapedTotalMatchups(
        sortArrayBy(totalMatchups, "totalWinPer", true)
      )
    );

    deleteInsertDispatch(
      null,
      null,
      ownerMatchupsCollection,
      year,
      compiledMatchups,
      null,
      false
    );
  };
};

const addFootballPoints = (footballMatchups, fullScheduleArray, teamNumber) => {
  // loop through each "week" (ie group of 5 matchups)
  fullScheduleArray.forEach(week => {
    let myTeamPointsFor = 0;
    let opposingTeamId = "";
    let opposingTeamPointsAgainst = 0;

    // Loop through each matchup (5 in total), only return one that has desired team in it
    const matchedMatchup = week.filter(matchup => {
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
      footballMatchups[
        opposingTeamId
      ].pointsAgainst += opposingTeamPointsAgainst;
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
        const {
          wins,
          losses,
          ties,
          pointsFor,
          pointsAgainst,
          percentage
        } = matchups[opposingTeams];
        const ownerMatchups = {
          ownerNames,
          wins,
          losses,
          ties,
          pointsFor: round(pointsFor, 1),
          pointsAgainst: round(pointsAgainst, 1),
          pointsDiff: round(pointsFor - pointsAgainst, 1),
          winPer: round(percentage, 3)
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
            winPer
          };
          matchupsArray.push(ownerMatchups);
        }
      }
    }
  }
  // if no matchups, sport is not finished yet, just return empty array
  return matchupsArray;
};

const displayMatchups = (year, teamNumber) => {
  return async function(dispatch) {
    //connect to mongo
    const ownerCollection = returnMongoCollection(`owner${teamNumber}Matchups`);

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

const sortTable = matchups => {
  return async function(dispatch) {
    dispatch(actions.sortMatchups(matchups));
  };
};

export { scrapeMatchups, displayMatchups, sortTable };
