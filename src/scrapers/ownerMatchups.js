import axios from "axios";
import round from "lodash/round";

const retrieveSportMatchups = (sport, year, teamNumber) => {
  let url;
  switch (sport) {
    case "basketball":
      url =
        "http://fantasy.espn.com/apis/v3/games/fba/seasons/" +
        year +
        "/segments/0/leagues/100660?view=standings";
      break;
    case "baseball":
      url =
        "http://fantasy.espn.com/apis/v3/games/flb/seasons/" +
        year +
        "/segments/0/leagues/109364?view=standings";
      break;
    case "football":
      url =
        "http://fantasy.espn.com/apis/v3/games/ffl/seasons/" +
        year +
        "/segments/0/leagues/154802?view=standings";
      break;
    default:
      url = "";
      break;
  }

  return axios.get(url).then(response => {
    console.log("response", response);
    const teamNumberArrayIndex = Number(teamNumber) - 1;
    console.log("team", response.data.teams[teamNumberArrayIndex]);
    return response.data.teams[teamNumberArrayIndex];
  });
};

export { retrieveSportMatchups };
