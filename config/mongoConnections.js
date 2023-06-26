const { MongoClient, ServerApiVersion } = require('mongodb');
const settings = require('./settings');
const mongoConfig = settings.mongoConfig;
let _connection = undefined;
let _db = undefined;

module.exports = {
  connectToDb: async () => {
    const client = new MongoClient(mongoConfig.serverUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    try {
      if (!_connection) {
        _connection = await client.connect();
        await client.db(mongoConfig.database).command({ ping: 1});
        _db = _connection.db(mongoConfig.database);
        return _db;
      }
    } catch(e) {
      console.log(e);
      _connection.close();
      throw new Error(e.message);
    }
  },
  closeConnection: () => {
    _connection.close();
  }
};