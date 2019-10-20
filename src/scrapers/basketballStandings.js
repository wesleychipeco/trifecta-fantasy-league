import axios from "axios";
import round from "lodash/round";

const basketballStandingsScraper = year => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/fba/seasons/" +
        year +
        "/segments/0/leagues/100660?view=standings"
    )
    .then(response => {
      const h2hStandingsArray = [];
      const rotoStatsArray = [];

      response.data.teams.forEach(team => {
        const teamName = team.location + " " + team.nickname;
        const ownerIds = team.owners;
        h2hStandingsArray.push({
          teamName,
          ownerIds,
          wins: team.record.overall.wins,
          losses: team.record.overall.losses,
          ties: team.record.overall.ties,
          winPer: round(team.record.overall.percentage, 3),
        });

        rotoStatsArray.push({
          teamName,
          ownerIds,
          FGPER: round(team.valuesByStat["19"], 4),
          FTPER: round(team.valuesByStat["20"], 4),
          THREEPM: team.valuesByStat["17"],
          REB: team.valuesByStat["6"],
          AST: team.valuesByStat["3"],
          STL: team.valuesByStat["2"],
          BLK: team.valuesByStat["1"],
          TO: team.valuesByStat["11"],
          PTS: team.valuesByStat["0"],
        });
      });

      return [h2hStandingsArray, rotoStatsArray];
    });
};

export { basketballStandingsScraper };
