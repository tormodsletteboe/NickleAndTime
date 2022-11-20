const express = require('express');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();


router.get('/:severity', rejectUnauthenticated, (req, res) => {
    // console.log('in GET / message');
    const sqlText =`
    SELECT * FROM messages
    WHERE severity = $1
    ORDER BY RANDOM()
    LIMIT 1
    ;`;
    // console.log('req.body.severity',req.params.severity);
    const params =[req.params.severity];
    pool.query(sqlText, params)
        .then((dbRes) => {
            res.send(dbRes.rows);
        })
        .catch((err) => {
            console.error('error in GET / messages.router',err);
            res.sendStatus(500);
        });
});

module.exports = router;