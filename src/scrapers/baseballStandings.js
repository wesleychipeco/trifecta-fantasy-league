import axios from "axios";

const h2hStandingsScraper = () => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/flb/seasons/2019/segments/0/leagues/109364?view=standings"
    )
    .then(response => {
      const standingsArray = [];

      response.data.teams.forEach(team => {
        standingsArray.push({
          teamName: team.location + " " + team.nickname,
          wins: team.record.overall.wins,
          losses: team.record.overall.losses,
          ties: team.record.overall.ties,
          winPer: team.record.overall.percentage.toFixed(3),
        });
      });
      return standingsArray;
    });
};

const rotoStatsScraper = () => {
  return axios
    .get(
      "http://fantasy.espn.com/apis/v3/games/flb/seasons/2019/segments/0/leagues/109364?view=standings"
    )
    .then(response => {
      const standingsArray = [];

      response.data.teams.forEach(team => {
        standingsArray.push({
          teamName: team.location + " " + team.nickname,
          R: team.valuesByStat["20"],
          HR: team.valuesByStat["5"],
          RBI: team.valuesByStat["21"],
          K: team.valuesByStat["27"],
          SB: team.valuesByStat["23"],
          OBP: team.valuesByStat["17"].toFixed(4),
          SO: team.valuesByStat["48"],
          QS: team.valuesByStat["63"],
          W: team.valuesByStat["53"],
          SV: team.valuesByStat["57"],
          ERA: team.valuesByStat["47"].toFixed(3),
          WHIP: team.valuesByStat["41"].toFixed(3),
        });
      });

      return standingsArray;
    });
};

export { h2hStandingsScraper, rotoStatsScraper };
