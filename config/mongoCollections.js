const dbConnection = require('./mongoConnections');

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.connectToDb();
      _col = db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
  assets: getCollectionFn('assets'),
  contributors: getCollectionFn('contributors'),
  models: getCollectionFn('models'),
  reports: getCollectionFn('reports'),
  admins: getCollectionFn('admins')
};
