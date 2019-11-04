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
} from "./matchupsActionTypes";
import {
  returnMongoCollection,
  findFromMongoSaveToRedux,
  deleteInsertDispatch,
} from "../../databaseManagement";
import { retrieveSportMatchups } from "../../scrapers/ownerMatchups";
import { basketballMatchups2019 } from "../../dataJSONS/basketballMatchups2019";
import { sortArrayBy } from "../../utils";
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

    const rawFootballMatchups = footballSeasonEnded
      ? await retrieveSportMatchups("football", year, footballTeamNumber)
      : undefined;
    const footballMatchups = await compileMatchups(
      rawFootballMatchups,
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
      footballMatchups,
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
        sortArrayBy(footballMatchups, "winPer", true)
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

const compileMatchups = (matchups, teamsList, sport) => {
  let matchupsArray = [];
  if (matchups) {
    if (sport === "football") {
      // TODO compile points for and against points per opponent
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

const displayMatchups = (year, teamNumber) => {
  return async function(dispatch) {
    //connect to mongo
    const ownerCollection = returnMongoCollection(
      "owner" + teamNumber + "Matchups"
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

const sortTable = matchups => {
  return async function(dispatch) {
    dispatch(actions.sortMatchups(matchups));
  };
};

export { scrapeMatchups, displayMatchups, sortTable };
