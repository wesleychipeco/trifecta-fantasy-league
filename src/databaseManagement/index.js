import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
import { sortArrayBy } from "../utils";

const returnMongoCollection = collectionName => {
  const stitchAppClient = Stitch.defaultAppClient;
  const mongoClient = stitchAppClient.getServiceClient(
    RemoteMongoClient.factory,
    "mongodb-atlas"
  );

  const db = mongoClient.db("trifecta");
  return db.collection(collectionName);
};

const deleteAndInsert = (dispatch, action, collection, data) => {
  collection
    .deleteMany({})
    .then(result => {
      console.log(`Deleted ${result.deletedCount} documents.`);
      collection
        .insertMany(data)
        .then(result1 => {
          console.log(`Trifecta Mongo db documents inserted!`);
          dispatch(action(data));
        })
        .catch(err1 => {
          console.log(`Failed to insert documents: ${err1}`);
        });
    })
    .catch(err => console.log(`Failed to delete documents: ${err}`));
};

const findAndSaveToRedux = (
  dispatch,
  action,
  collection,
  defaultSortColumn,
  extractKey = ""
) => {
  if (extractKey) {
    collection
      .find({}, { projection: { _id: 0 } })
      .asArray()
      .then(docs => {
        const extractedArray = docs[0][extractKey];
        dispatch(action(sortArrayBy(extractedArray, defaultSortColumn, true)));
      })
      .catch(err => {
        console.log("error!", err);
      });
  } else {
    collection
      .find({}, { projection: { _id: 0 }, sort: { [defaultSortColumn]: -1 } })
      .asArray()
      .then(docs => {
        dispatch(action(docs));
      })
      .catch(err => {
        console.log("error!", err);
      });
  }
};

const filterIdField = array => {
  const filteredArray = [];
  array.forEach(eachPayload => {
    const filteredPayload = Object.keys(eachPayload)
      .filter(key => key.valueOf() !== "_id")
      .reduce((object, key) => {
        object[key] = eachPayload[key];
        return object;
      }, {});
    filteredArray.push(filteredPayload);
  });
  return filteredArray;
};

export {
  returnMongoCollection,
  deleteAndInsert,
  findAndSaveToRedux,
  filterIdField,
};
