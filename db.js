/** db.js */

const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql:///biztime"
});

client.connect();


module.exports = client;