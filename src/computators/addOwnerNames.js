import { returnMongoCollection } from "../databaseManagement";

// function that returns an array of the ownerId to ownerName object mappings from mongodb
const retriveOwnerIdsOwnerNamesArray = () => {
  const ownerIdsCollection = returnMongoCollection("ownerIds");
  return ownerIdsCollection
    .find({}, { projection: { _id: 0 } })
    .asArray()
    .then((docs) => docs);
};

const returnOwnerNamesArray = (ownerIdsOwnerNamesArray, ownersPerTeam) => {
  const ownerNames = [];
  // for each ownerId per trifecta team
  ownersPerTeam.forEach((ownerId) => {
    // in the array of ownerId/ownerNames, find the object where the ownerIds are the same
    // and return the "ownerName" value from that object and add it to the array
    const ownerName = ownerIdsOwnerNamesArray.find(
      (ownerIdsOwnerNames) => ownerIdsOwnerNames.ownerId === ownerId
    ).ownerName;
    ownerNames.push(ownerName);
  });

  // return the ownerNames array to be joined into string later
  return ownerNames;
};

const addOwnerNames = (ownerIdsOwnerNamesArray, dataArray) => {
  // for each team in the standings
  dataArray.forEach((team) => {
    const teamOwnerIds = team.ownerIds;
    // pass into the function the array of ownerIds per team
    const ownerNames = returnOwnerNamesArray(
      ownerIdsOwnerNamesArray,
      teamOwnerIds
    );
    // join the returned array and add it to the team object and return the array
    team.ownerNames = ownerNames.join(", ");
  });
  return dataArray;
};

const returnOwnerNamesUnderscored = (standingsWithOwnerNames) => {
  const ownerNamesUnderscored = [];
  standingsWithOwnerNames.forEach((team) => {
    const underscoredNames = team.ownerNames.replaceAll(" ", "_");
    const ownerTeamNameObject = {
      ownerNames: underscoredNames,
      teamName: team.teamName,
    };
    ownerNamesUnderscored.push(ownerTeamNameObject);
  });
  return ownerNamesUnderscored;
};

export {
  addOwnerNames,
  returnOwnerNamesArray,
  retriveOwnerIdsOwnerNamesArray,
  returnOwnerNamesUnderscored,
};
