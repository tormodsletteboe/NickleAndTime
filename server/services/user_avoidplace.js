const pool = require('../modules/pool');

//user have stayed to long at a place, increment the visit count
async function incrementVisitCount(user_id, avoid_place_id) {
    try {
        const sqlText = `
            UPDATE user_avoidplace
            SET visit_count = visit_count + 1
            WHERE user_id = $1 AND avoid_place_id = $2
            ;`;
        const params = [user_id, avoid_place_id];

        let dbRes = await pool.query(sqlText, params);
        console.log(`Incremented User: ${user_id} at place: ${avoid_place_id}`);
    }
    catch (error) {
        console.error('incrementVisitCount failed: ', error);
    }
}

//this code is intended to run 1 time per day, to check if visit_count needs to be reset. it should be reset every 7 days
//if visit_count needs to be reset, also set next_reset_date to 7 days from now.
async function resetVisitCount() {
    try {
        const sqlText = `
    UPDATE user_avoidplace
    SET visit_count = 0, next_reset_date = now()+ INTERVAL '7 days'
    WHERE next_reset_date < now()
    ;`;

        let dbRes = await pool.query(sqlText);
        console.log(`Server reset the visit count on ${dbRes.rowCount} rows`);
    }
    catch (error) {
        console.error('resetVisitCount failed: ', err);
    }

}

module.exports = {
    incrementVisitCount,
    resetVisitCount,
}