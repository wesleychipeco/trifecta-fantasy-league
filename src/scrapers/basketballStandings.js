import axios from "axios";
import round from "lodash/round";

const h2hStandingsScraper = year => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/fba/seasons/" +
        year +
        "/segments/0/leagues/100660?view=standings"
    )
    .then(response => {
      const standingsArray = [];

      response.data.teams.forEach(team => {
        standingsArray.push({
          teamName: team.location + " " + team.nickname,
          ownerIds: team.owners,
          wins: team.record.overall.wins,
          losses: team.record.overall.losses,
          ties: team.record.overall.ties,
          winPer: round(team.record.overall.percentage, 3),
        });
      });

      return standingsArray;
    });
};

const rotoStatsScraper = year => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/fba/seasons/" +
        year +
        "/segments/0/leagues/100660?view=standings"
    )
    .then(response => {
      const rotoStatsArray = [];

      response.data.teams.forEach(team => {
        rotoStatsArray.push({
          teamName: team.location + " " + team.nickname,
          ownerIds: team.owners,
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

      return rotoStatsArray;
    });
};

export { h2hStandingsScraper, rotoStatsScraper };
