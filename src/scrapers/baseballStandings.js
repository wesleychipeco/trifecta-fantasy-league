import axios from "axios";
import round from "lodash/round";

const baseballStandingsScraper = year => {
  return axios
    .get(
      `http://fantasy.espn.com/apis/v3/games/flb/seasons/${year}/segments/0/leagues/109364?view=standings`
    )
    .then(response => {
      const h2hStandingsArray = [];
      const rotoStatsArray = [];

      response.data.teams.forEach(team => {
        const teamName = `${team.location}  ${team.nickname}`;
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
          R: team.valuesByStat["20"],
          HR: team.valuesByStat["5"],
          RBI: team.valuesByStat["21"],
          K: team.valuesByStat["27"],
          SB: team.valuesByStat["23"],
          OBP: round(team.valuesByStat["17"], 4),
          SO: team.valuesByStat["48"],
          QS: team.valuesByStat["63"],
          W: team.valuesByStat["53"],
          SV: team.valuesByStat["57"],
          ERA: round(team.valuesByStat["47"], 3),
          WHIP: round(team.valuesByStat["41"], 3),
        });
      });

      return [h2hStandingsArray, rotoStatsArray];
    });
};

export { baseballStandingsScraper };
