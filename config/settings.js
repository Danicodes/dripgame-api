require('dotenv').config();
module.exports = {
    "mongoConfig": {
      "serverUrl": process.env.MONGOURI,
      "database": "dripgame"
    }
}