const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const phoneNubmer = req.body.phoneNumber;
  // console.log('xxxxxxxxxxxx',phoneNubmer);
  const queryText = `INSERT INTO "user" (username, password, phone_number)
    VALUES ($1, $2, $3) RETURNING id`;
  pool
    .query(queryText, [username, password, phoneNubmer])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

router.post('/places', rejectUnauthenticated, (req, res) => {

  //send data to database
  console.log('in POST');
  const queryText = `
  INSERT INTO avoid_place (name,latitude,longitude,google_place_id)
  VALUES ($1,$2,$3,$4)
  ON CONFLICT (google_place_id)
  DO UPDATE SET
    "name" = $1
  RETURNING id
  ;`;
  const params = [req.body.name, req.body.latitude, req.body.longitude, req.body.google_place_id];
  pool.query(queryText, params)
    .then((dbRes) => {
      console.log('sdfasdfasdfasdfa', dbRes.rows[0].id);
      const sqlText = `
  INSERT INTO user_avoidplace (user_id,avoid_place_id,visit_limit,"user_id_CONCAT_avoid_place_id")
  VALUES ($1,$2,$3,$4)
  ON CONFLICT ("user_id_CONCAT_avoid_place_id")
  DO NOTHING
  ;`;
      const simpleGUID = req.body.user_id + '_' + dbRes.rows[0].id; //concat a simple GUID
      const params2 = [req.body.user_id, dbRes.rows[0].id, req.body.visit_limit, simpleGUID];
      pool.query(sqlText, params2)
        .then((dbRes2) => {
          res.sendStatus(201);
        })
        .catch((err) => {
          console.log('POST user_avoid_place failed: ', err);
          res.sendStatus(500);
        })
    })
    .catch((err) => {
      console.log('POST avoid_place failed: ', err);
      res.sendStatus(500);
    });

});


router.get('/places', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT 
          avoid_place."name",
          user_avoidplace.visit_count,
          user_avoidplace.visit_limit,
          user_avoidplace.active,
          avoid_place.latitude,
          avoid_place.longitude
    FROM "user_avoidplace"
    LEFT JOIN avoid_place ON avoid_place.id = user_avoidplace.avoid_place_id
    WHERE "user_id" = $1
    ;`;
  const sqlParams = [req.user.id];
  pool.query(sqlText, sqlParams)
    .then((dbRes) => {
      console.log('dbRes.rows asdfasdfasdf',dbRes.rows);
      res.send(dbRes.rows);
    })
    .catch((err) => {
      console.log('GET /places failed: ', err);
      res.sendStatus(500);
    });
});
module.exports = router;
