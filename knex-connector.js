// const knex = require('knex');
// knex CONNECTOR
// const connectedKnex = knex({
//   client: 'sqlite3',
//   connection: {
//     filename: 'hw1.db'
//   }
// })

// knex CONNECTOR
const connectedKnex = require('knex')({
    client: 'pg',
    version: '12',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      database: 'aero_db',
      password: 'admin'
    }
  });

module.exports = connectedKnex;
// module.exports = connectedKnex1;