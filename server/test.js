
// const axios = require('axios');
const pool = require('../server/modules/pool');
const cron = require('node-cron');


cron.schedule('*/10 * * * * *', () => {
    let date = new Date();
    console.log(date.toLocaleTimeString());
    console.log('running a task every 10 seconds');
    //resetVisitCount();
});

async function resetVisitCount() {

    const sqlText = `
    UPDATE user_avoidplace
    SET visit_count = 0, next_reset_date = now()+ INTERVAL '7 days'
    WHERE next_reset_date < now()
    ;`;

    await pool.query(sqlText)
        .then((dBRes) => {
            
            console.log(`Server reset the visit count on ${dBRes.rowCount} rows`);
        })
        .catch((err) => {
            console.log('resetVisitCount failed: ', err);

        });

}

module.exports = cron;

// resetVisitCount();
