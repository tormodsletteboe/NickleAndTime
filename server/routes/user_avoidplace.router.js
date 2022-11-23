const express = require('express');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();


//for current user get: 
router.put('/incrementVisitCount', rejectUnauthenticated, async (req, res) => {


    try {
        const sqlText = `
        UPDATE user_avoidplace
        SET visit_count = visit_count + 1
        WHERE user_id = $1 AND avoid_place_id = $2
    ;`;
        const params = [req.user.id, req.body.place_id];

        let dbRes = await pool.query(sqlText, params);
        
        res.sendStatus(200);

    } catch (error) {
        console.log('PUT /incrementVisitCount failed: ', error);
        res.sendStatus(500);
    }
    // pool.query(sqlText, params)
    //     .then((dBRes) => {
    //         res.sendStatus(200);
    //     })
    //     .catch((err) => {
    //         console.log('PUT /incrementVisitCount failed: ', err);
    //         res.sendStatus(500);
    //     });
});


//resetVisitCount
router.put('/resetVisitCount', rejectUnauthenticated, (req, res) => {
    // console.log('in PUT resetVisitCount');
    //this code should run everyday at the same time ie 7 pm or midnight, but once a day is fine too
    const sqlText = `
    UPDATE user_avoidplace
    SET visit_count = 0, next_reset_date = now()+ INTERVAL '7 days'
    WHERE next_reset_date < now()
    ;`;

    pool.query(sqlText)
        .then((dBRes) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('PUT /resetVisitCount failed: ', err);
            res.sendStatus(500);
        });
});

module.exports = router;