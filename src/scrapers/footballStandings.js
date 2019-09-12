import axios from "axios";

const footballStandingsScraper = () => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/154802?view=standings"
    )
    .then(response => {
      console.log("response", response);
      const standingsArray = [];

      response.data.teams.forEach(team => {
        standingsArray.push({
          teamName: team.location + " " + team.nickname,
          wins: team.record.overall.wins,
          losses: team.record.overall.losses,
          ties: team.record.overall.ties,
          winPer: team.record.overall.percentage.toFixed(3),
          pointsFor: team.record.overall.pointsFor.toFixed(1),
          pointsAgainst: team.record.overall.pointsAgainst.toFixed(1),
        });
      });

      return standingsArray;
    });
};

export { footballStandingsScraper };
