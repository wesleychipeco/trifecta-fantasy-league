const baseballStandingsComputator = baseballStandings => {
  baseballStandings.sort((a, b) => (a.winPer < b.winPer ? 1 : -1));

  // Starting value for trifecta points to give out
  let trifectaPoints = 10;
  let individualTrifectaPoints, distributedPoints;

  // Initialize factors to determine trifecta points if there is a tie
  let pointsHold = [];
  let timesDistributed = 0;

  for (let i = 0; i < baseballStandings.length; i++) {
    // Initialize how many teams tied with current team
    let sameRecords = 0;

    let currentTeamWinPer = baseballStandings[i].winPer;

    for (let j = 0; j < baseballStandings.length; j++) {
      let compareTeamWinPer = baseballStandings[j].winPer;

      // if 2 teams tied in win per, increase number of teams with same record
      if (currentTeamWinPer === compareTeamWinPer) {
        sameRecords += 1;
      }
    }

    // after done with inner loop of all teams to find matches, determine whether to go into tie process or not
    // there will always be at least 1 team with same record (itself), so if > 1, go in to tie process
    if (sameRecords > 1) {
      // if this is the first time finding the tie, initialize distributed tied points
      if (pointsHold.length === 0) {
        // points to be averaged and split are a range of (trifecta points - # of teams tied, trifecta points)
        for (
          let k = trifectaPoints - sameRecords + 1;
          k < trifectaPoints + 1;
          k++
        ) {
          pointsHold.push(k);
        }

        // range of points allocated is summed and averaged
        distributedPoints = 0;
        for (let x = 0; x < pointsHold.length; x++) {
          distributedPoints += pointsHold[x];
        }
        distributedPoints /= sameRecords;
      }

      // now that points have been averaged, each tied team gets this same number of points
      individualTrifectaPoints = distributedPoints;
      timesDistributed += 1;

      // if all tied team's points have been distributed, then reset counts
      if (timesDistributed === sameRecords) {
        pointsHold = [];
        timesDistributed = 0;
      }
    } else {
      individualTrifectaPoints = trifectaPoints;
    }

    // at the end of each loop of each team, decrease the number of trifecta points
    trifectaPoints -= 1;
    // console.log("team", baseballStandings[i].teamName);
    // console.log("trifecta points", individualTrifectaPoints);

    baseballStandings[i]["h2hTrifectaPoints"] = individualTrifectaPoints;
  }
  return baseballStandings;
};

export { baseballStandingsComputator };
