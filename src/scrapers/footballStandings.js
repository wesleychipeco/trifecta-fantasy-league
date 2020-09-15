import axios from "axios";
import round from "lodash/round";

const footballStandingsScraper = (year) => {
  return axios
    .get(
      `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/154802?view=mTeam`
    )
    .then((response) => {
      const h2hStandingsArray = [];

      response.data.teams.forEach((team) => {
        h2hStandingsArray.push({
          teamName: `${team.location} ${team.nickname}`,
          ownerIds: team.owners,
          wins: team.record.overall.wins,
          losses: team.record.overall.losses,
          ties: team.record.overall.ties,
          winPer: round(team.record.overall.percentage, 3),
          pointsFor: round(team.record.overall.pointsFor, 1),
          pointsAgainst: round(team.record.overall.pointsAgainst, 1),
        });
      });

      return h2hStandingsArray;
    });
};

export { footballStandingsScraper };
