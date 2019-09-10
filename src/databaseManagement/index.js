const deleteAndInsert = (collection, data) => {
  collection
    .deleteMany({})
    .then(result => {
      console.log(`Deleted ${result.deletedCount} documents.`);
      collection
        .insertMany(data)
        .then(result1 => {
          console.log(`Trifecta Baseball Standings documents inserted!`);
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
  defaultSortDirection = true
) => {
  const sortDirection = defaultSortDirection ? -1 : 1;

  collection
    .find({}, { sort: { [defaultSortColumn]: sortDirection } })
    .asArray()
    .then(docs => {
      dispatch(action(docs));
    })
    .catch(err => {
      console.log("error!", err);
    });
};

export { deleteAndInsert, findAndSaveToRedux };
