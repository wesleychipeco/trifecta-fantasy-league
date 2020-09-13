import round from "lodash/round";

const calculateTop5Bottom5Standings = (
  top5Bottom5TotalObject,
  ownerNamesUnderscored
) => {
  // Total compiled standings array
  const top5Bottom5CompiledStandings = [];
  // Loop through each owner
  for (let i = 0; i < ownerNamesUnderscored.length; i++) {
    const teamOwnerObject = ownerNamesUnderscored[i];
    const { ownerNames, teamName } = teamOwnerObject;

    // Per owner object for display
    const top5Bottom5OwnerObject = {
      ownerNames: ownerNames.replaceAll("_", " "),
      teamName: teamName,
    };

    // Per owner Top5Bottom5 totals array
    const ownerTop5Bottom5Array = top5Bottom5TotalObject[ownerNames];
    let wins = 0;
    let losses = 0;
    // Loop through each week
    for (let j = 0; j < ownerTop5Bottom5Array.length; j++) {
      const weekObject = ownerTop5Bottom5Array[j];

      if (weekObject.win) {
        wins++;
      } else {
        losses++;
      }
      const weekName = `week${j + 1}`;
      top5Bottom5OwnerObject[weekName] = weekObject;
    }

    // Add record string and winPer to object
    const recordString = `${wins}-${losses}`;
    const winPer = round(wins / (wins + losses), 3);
    top5Bottom5OwnerObject.record = recordString;
    top5Bottom5OwnerObject.winPer = winPer;

    top5Bottom5CompiledStandings.push(top5Bottom5OwnerObject);
  }
  return top5Bottom5CompiledStandings;
};

export { calculateTop5Bottom5Standings };
