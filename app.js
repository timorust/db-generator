const axios = require('axios');
const config = require('config');
const fs = require('fs');
const Pool = require('pg').Pool;
// 1 => read from config
// config
const db_conn = config.get('db');
const scale = config.get('scale');
console.log(db_conn);
console.log(scale);

// connect to db
const pool = new Pool({
  user: db_conn.user,
  host: db_conn.host,
  database: db_conn.database,
  password: db_conn.password,
  port: db_conn.port
})

// const connectedKnex = require('knex');
// const deleteAll = async () => {
//   try {
  
//   await connectedKnex.raw(`call sp_delete_all()`);
// }

//   catch(e) {
//     console.log(e.message) 
//   }
// console.log('delete completed');
// createCountries();
// console.log('countries inserted');
 
// }

// deleteAll();
// 2 => clear the db
// call sp than deletes all the tables and reset the auto increment key
const deleteAll = async () => {
  try {
  await pool.query(`call sp_delete_all()`, (err, res) => {
  if (err) console.log(err)
 });
}
  catch(e) {
    console.log(e.message) 
  }
 
}
deleteAll();

console.log('delete completed');

const createCountries = async () => {
  // 3 => create the data
// 3.1 local file: i.e countries, airlines, ...
let fileString = fs.readFileSync('data\\countries.json', {encoding:'utf8', flag:'r'});
let data = JSON.parse(fileString)
// //console.log(data[15].name);

// // demo code
for(let i = 0; i < data.length; i++) {
  // call sp_insert_country(data[i].name)
  await pool.query(`select * from sp_insert_countries('${data[i].name}')`, (err, res) => {
    if (err) console.log(err)
  })
}
}
createCountries();
console.log('countries inserted');


// 3.2 fetch from the internet
// 3.3 generate data by code, i.e departure time, landing time -- random
//  remaining tickets, credit-card -- random 
//  logic (?): flight with 0 remain, 0 tickets
//  log-file - write the amount created
// *bonus => run ............ui indication
//           creating airlines ..........................
//           creating customers ..........................                                                  

// bring data from internet

const makeGet = async() => {
  try {
    // results=10&seed=abc
    const response = await axios.get('https://randomuser.me/api?results=10')
    let data = response.data.results
    for(let i = 0; i < data.length; i++) {
      // console.log(response.data.results[i].location.city)
      await pool.query(`select * from sp_insert_customers('${data[i].name.first}', 
      '${data[i].name.last}', '${data[i].location.city}', '${data[i].phone}', 
      '${data[i].cell}', '${data[i].login.username}', 
      '${data[i].login.password}', '${data[i].email}')`, (err, res) => {
       if(err) console.log(err);
      })
      await pool.query(`select * from sp_insert_airlines('${data[i].location.street.name}', 
      '${data[i].location.country}', '${data[i].location.state}', '${data[i].login.salt}',
      '${data[i].id.value}')`, (err, res) => {
       if(err) console.log(err);
      })
    }
    for(let i=0; i< 30; i++) {
        await pool.query(`select * from sp_insert_flights('${i}','${i}','${i}','${'2020/10/10 10:30'}', '${'2020/10/10 10:30'}', '${i+20}')`, (err, res) => {
       if(err) console.log(err);
      })

        await pool.query(`select * from sp_insert_tickets('${i}','${i}')`, (err, res) => {
       if(err) console.log(err);
      })

    }
  }
  catch (err) {
    console.log('===================== received error =>', err.message);
  }
}
makeGet();

// async function makeGet() {
//     try {
//     // results=10&seed=abc
//     const response = await axios.get('https://randomuser.me/api?results=10')
//     let data = response.data.results
//     for(let i = 0; i < data.length; i++) {
//       // console.log(response.data.results[i].location.city)
//       const res = await pool.query(`select * from sp_insert_customers('${data[i].name.first}', 
//       '${data[i].name.last}', '${data[i].location.city}', '${data[i].phone}', 
//       '${data[i].cell}', '${data[i].login.username}', 
//       '${data[i].login.password}', '${data[i].email}')`
//       )
//        const res1 = await pool.query(`select * from sp_insert_airlines('${data[i].location.street.name}', 
//       '${data[i].location.country}', '${data[i].location.state}', '${data[i].login.salt}',
//       '${data[i].id.value}')`
//       )
//     }
//   }
//   catch (err) {
//     console.log('received error:', err);
//   }
// }
// makeGet();