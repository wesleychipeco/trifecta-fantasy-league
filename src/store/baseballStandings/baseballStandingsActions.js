import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
import { createAction } from "redux-starter-kit";
import {
  SCRAPE_H2H_BASEBALL_STANDINGS_START,
  SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_H2H_BASEBALL_STANDINGS_FAILED,
  SAVE_H2H_STANDINGS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_START,
  SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS,
  SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED,
  SAVE_ROTO_STATS,
  SAVE_ROTO_STANDINGS,
  SAVE_TRIFECTA_STANDINGS,
  SET_LAST_SCRAPED,
  SORT_TABLE,
} from "./baseballStandingsActionTypes";
import {
  h2hStandingsScraper,
  rotoStatsScraper,
} from "../../scrapers/baseballStandings";
import { assignRankPoints } from "../../computators/assignRankPoints";
import { sumRotoPoints } from "../../computators/sumRotoPoints";
import { format } from "date-fns";
import { sortArrayBy } from "../../utils";
import { deleteAndInsert, findAndSaveToRedux } from "../../databaseManagement";

const actions = {
  scrapeH2HBaseballStandingsStart: createAction(
    SCRAPE_H2H_BASEBALL_STANDINGS_START
  ),
  scrapeH2HBaseballStandingsSuccess: createAction(
    SCRAPE_H2H_BASEBALL_STANDINGS_SUCCESS
  ),
  scrapeH2HBaseballStandingsFailed: createAction(
    SCRAPE_H2H_BASEBALL_STANDINGS_FAILED
  ),
  saveH2HStandings: createAction(SAVE_H2H_STANDINGS),
  scrapeRotoBaseballStandingsStart: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_START
  ),
  scrapeRotoBaseballStandingsSuccess: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_SUCCESS
  ),
  scrapeRotoBaseballStandingsFailed: createAction(
    SCRAPE_ROTO_BASEBALL_STANDINGS_FAILED
  ),
  saveRotoStats: createAction(SAVE_ROTO_STATS),
  saveRotoStandings: createAction(SAVE_ROTO_STANDINGS),
  saveTrifectaStandings: createAction(SAVE_TRIFECTA_STANDINGS),
  setLastScraped: createAction(SET_LAST_SCRAPED),
  sortTable: createAction(SORT_TABLE),
};

const assignRotoCategoryPoints = rotoStandings => {
  const rotoCategoriesArray = [
    { category: "R", sortDirection: "highToLow" },
    { category: "HR", sortDirection: "highToLow" },
    { category: "RBI", sortDirection: "highToLow" },
    { category: "K", sortDirection: "lowToHigh" },
    { category: "SB", sortDirection: "highToLow" },
    { category: "OBP", sortDirection: "highToLow" },
    { category: "SO", sortDirection: "highToLow" },
    { category: "QS", sortDirection: "highToLow" },
    { category: "W", sortDirection: "highToLow" },
    { category: "SV", sortDirection: "highToLow" },
    { category: "ERA", sortDirection: "lowToHigh" },
    { category: "WHIP", sortDirection: "lowToHigh" },
  ];

  for (const rotoCategory of rotoCategoriesArray) {
    rotoStandings = assignRankPoints(
      rotoStandings,
      rotoCategory.category,
      rotoCategory.sortDirection,
      rotoCategory.category + "Points",
      10,
      1
    );
  }

  return sumRotoPoints(rotoStandings, "totalPoints");
};

const scrapeBaseballStandings = () => {
  return async function(dispatch) {
    const h2hStandings = await h2hStandingsScraper();
    dispatch(actions.scrapeH2HBaseballStandingsStart);

    const rotoStandings = await rotoStatsScraper();
    dispatch(actions.scrapeRotoBaseballStandingsStart);

    if (h2hStandings) {
      dispatch(actions.scrapeH2HBaseballStandingsSuccess);
      if (rotoStandings) {
        dispatch(actions.setLastScraped(format(new Date(), "M/D/YY h:mm:ss")));
        dispatch(actions.scrapeRotoBaseballStandingsSuccess);
        const rotoStats = [...rotoStandings];

        // H2H Standings
        const h2hStandingsWithTrifectaPoints = await assignRankPoints(
          h2hStandings,
          "winPer",
          "highToLow",
          "h2hTrifectaPoints",
          10,
          1
        );

        // Roto Standings
        const rotoStandingsWithRotoPoints = assignRotoCategoryPoints(
          rotoStandings
        );
        const rotoStandingsWithTrifectaPoints = await assignRankPoints(
          rotoStandingsWithRotoPoints,
          "totalPoints",
          "highToLow",
          "rotoTrifectaPoints",
          10,
          1
        );

        // connect to mongo
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
          RemoteMongoClient.factory,
          "mongodb-atlas"
        );
        const db = mongoClient.db("trifecta");

        const baseballTrifectaStandingsCollection = db.collection(
          "baseballTrifectaStandings2019"
        );
        const baseballH2HStandingsCollection = db.collection(
          "baseballH2HStandings2019"
        );
        const baseballRotoStandingsCollection = db.collection(
          "baseballRotoStandings2019"
        );
        const baseballRotoStatsCollection = db.collection(
          "baseballRotoStats2019"
        );

        deleteAndInsert(
          baseballH2HStandingsCollection,
          h2hStandingsWithTrifectaPoints
        );
        deleteAndInsert(
          baseballRotoStandingsCollection,
          rotoStandingsWithTrifectaPoints
        );
        deleteAndInsert(baseballRotoStatsCollection, rotoStats);
        deleteAndInsert(
          baseballTrifectaStandingsCollection,
          calculateTrifectaBaseballStandings(
            h2hStandingsWithTrifectaPoints,
            rotoStandingsWithTrifectaPoints
          )
        );

        // Save H2H Standings, Roto Standings, Roto Stats, and Trifecta Standings
        dispatch(actions.saveH2HStandings(h2hStandingsWithTrifectaPoints));
        dispatch(actions.saveRotoStandings(rotoStandingsWithTrifectaPoints));
        dispatch(actions.saveRotoStats(rotoStats));
        dispatch(
          actions.saveTrifectaStandings(
            calculateTrifectaBaseballStandings(
              h2hStandingsWithTrifectaPoints,
              rotoStandingsWithTrifectaPoints
            )
          )
        );
      } else {
        dispatch(actions.scrapeRotoBaseballStandingsFailed);
      }
    } else {
      dispatch(actions.scrapeH2HBaseballStandingsFailed);
    }
  };
};

const calculateTrifectaBaseballStandings = (h2hStandings, rotoStandings) => {
  if (h2hStandings.length > 0 && rotoStandings.length > 0) {
    const combinedStandingsArray = [];

    // Loop through H2H Standings, each team
    h2hStandings.forEach(team => {
      const combinedStandings = {};
      const teamName = team.teamName;

      const teamH2H = h2hStandings.find(
        h2hLoopingTeam => h2hLoopingTeam.teamName === teamName
      );

      const teamRoto = rotoStandings.find(
        rotoLoopingTeam => rotoLoopingTeam.teamName === teamName
      );

      const h2hPoints = teamH2H.h2hTrifectaPoints;
      const rotoPoints = teamRoto.rotoTrifectaPoints;

      combinedStandings.teamName = teamName;
      combinedStandings.h2hTrifectaPoints = h2hPoints;
      combinedStandings.rotoTrifectaPoints = rotoPoints;
      combinedStandings.totalTrifectaPoints = h2hPoints + rotoPoints;

      combinedStandingsArray.push(combinedStandings);
    });

    return sortArrayBy(combinedStandingsArray, "totalTrifectaPoints", true);
  }
};

const displayBaseballStandings = () => {
  return async function(dispatch) {
    // connect to mongo
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("trifecta");

    const baseballH2HStandings = db.collection("baseballH2HStandings2019");
    const baseballRotoStandings = db.collection("baseballRotoStandings2019");
    const baseballRotoStats = db.collection("baseballRotoStats2019");
    const baseballTrifectaStandings = db.collection(
      "baseballTrifectaStandings2019"
    );

    // Pull and save H2H Standings, Roto Standings, Roto Stats, and Trifecta Standings
    findAndSaveToRedux(
      dispatch,
      actions.saveH2HStandings,
      baseballH2HStandings,
      "h2hTrifectaPoints"
    );
    findAndSaveToRedux(
      dispatch,
      actions.saveRotoStandings,
      baseballRotoStandings,
      "rotoTrifectaPoints"
    );
    findAndSaveToRedux(dispatch, actions.saveRotoStats, baseballRotoStats, "R");
    findAndSaveToRedux(
      dispatch,
      actions.saveTrifectaStandings,
      baseballTrifectaStandings,
      "totalTrifectaPoints"
    );
  };
};

const sortTable = standings => {
  return async function(dispatch) {
    dispatch(actions.sortTable(standings));
  };
};

export { scrapeBaseballStandings, displayBaseballStandings, sortTable };
