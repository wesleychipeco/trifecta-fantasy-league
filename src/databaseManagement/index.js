import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
} from "mongodb-stitch-react-native-sdk";
import { sortArrayBy, sortArrayBySecondaryParameter } from "../utils";

const getMongoCollection = (appClient, collectionName) => {
  const mongoClient = appClient.getServiceClient(
    RemoteMongoClient.factory,
    "mongodb-atlas"
  );

  const db = mongoClient.db("trifecta");
  return db.collection(collectionName);
};

const returnMongoCollection = (collectionName) => {
  if (Stitch.hasAppClient("trifectafantasyleague-xqqjr")) {
    const app = Stitch.getAppClient("trifectafantasyleague-xqqjr");
    return getMongoCollection(app, collectionName);
  } else {
    return Stitch.initializeAppClient("trifectafantasyleague-xqqjr").then(
      (app) => {
        return app.auth
          .loginWithCredential(new AnonymousCredential())
          .then(() => {
            return getMongoCollection(app, collectionName);
          });
      }
    );
  }
};

const deleteInsertDispatch = (
  dispatch,
  action,
  collection,
  year,
  data,
  key,
  shouldDispatch
) => {
  collection
    .deleteOne({ year })
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} documents.`);
      collection
        .insertOne(data)
        .then((result1) => {
          console.log(`Mongo db documents inserted!`);
          if (shouldDispatch) {
            dispatch(action(data[key]));
          }
        })
        .catch((err1) => {
          console.log(`Failed to insert documents: ${err1}`);
        });
    })
    .catch((err) => console.log(`Failed to delete documents: ${err}`));
};

const findFromMongoSaveToRedux = (
  dispatch,
  action,
  collection,
  year,
  defaultSortColumn,
  extractKey
) => {
  const findQuery = { year };
  const findProjection = { projection: { _id: 0 } };
  if (extractKey === "footballMatchups") {
    collection
      .find(findQuery, findProjection)
      .asArray()
      .then((docs) => {
        const extractedArray = docs[0][extractKey];
        dispatch(
          action(
            sortArrayBySecondaryParameter(
              extractedArray,
              defaultSortColumn,
              "pointsDiff"
            )
          )
        );
      })
      .catch((err) => {
        console.log("error!", err);
      });
  } else {
    collection
      .find(findQuery, findProjection)
      .asArray()
      .then((docs) => {
        const extractedArray = docs[0][extractKey];
        dispatch(action(sortArrayBy(extractedArray, defaultSortColumn, true)));
      })
      .catch((err) => {
        console.log("error!", err);
      });
  }
};

const simpleFindFromMongoSaveToRedux = (
  dispatch,
  action,
  collection,
  defaultSortColumn
) => {
  collection
    .find({}, { projection: { _id: 0 } })
    .asArray()
    .then((docs) => {
      dispatch(action(sortArrayBy(docs, defaultSortColumn, true)));
    })
    .catch((err) => {
      console.log("Error!", err);
    });
};

const filterIdField = (array) => {
  const filteredArray = [];
  array.forEach((eachPayload) => {
    const filteredPayload = Object.keys(eachPayload)
      .filter((key) => key.valueOf() !== "_id")
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
  deleteInsertDispatch,
  findFromMongoSaveToRedux,
  simpleFindFromMongoSaveToRedux,
  filterIdField,
};
