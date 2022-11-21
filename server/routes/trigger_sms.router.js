const express = require('express');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();


router.post('/', rejectUnauthenticated, (req, res) => {
    console.log('in POST / trigger_sms');
    const sqlText = `
    INSERT INTO trigger_sms (user_id,avoid_place_id,message_id)
    VALUES ($1,$2,$3)
    ;`;
    console.log('req.user.id:', req.user.id);
    console.log('req.body.avoidPlace_id:', req.body.avoidPlace_id);
    console.log('req.body.msg_id:', req.body.msg_id);
    const params = [req.user.id, req.body.avoidPlace_id, req.body.msg_id];
    pool.query(sqlText, params)
        .then((dbRes) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.error('error in POST / trigger_sms router', err);
            res.sendStatus(500);
        });
});

module.exports = router;