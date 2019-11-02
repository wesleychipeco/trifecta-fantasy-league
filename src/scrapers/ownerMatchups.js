import axios from "axios";

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
    const teamNumberArrayIndex = Number(teamNumber) - 1;
    return response.data.teams[teamNumberArrayIndex].record.headToHead;
  });
};

export { retrieveSportMatchups };
