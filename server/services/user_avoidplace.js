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
        //console.log(`Incremented User: ${user_id} at place: ${avoid_place_id}`);
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
    SET visit_count = 0, next_reset_date = now()+ INTERVAL '5 minutes'
    WHERE next_reset_date < now()
    ;`;

        let dbRes = await pool.query(sqlText);
        //console.log(`Server reset the visit count on ${dbRes.rowCount} rows`);
    }
    catch (error) {
        console.error('resetVisitCount failed: ', err);
    }

}

//get visit count and visit limit
async function get_VisitCountAndVisitLimit(user_id, place_id) {
    try {
        const sqlText = `
            SELECT 
            "user_avoidplace".visit_count,
            "user_avoidplace".visit_limit
            FROM "user_avoidplace"
            WHERE user_avoidplace.user_id = $1 AND user_avoidplace.avoid_place_id= $2
    ;`;
        const params = [user_id,place_id];
        let dbRes = await pool.query(sqlText,params);
        // console.log(`Server get_VisitCountAndVisitLimit  ${dbRes.rowCount} rows`);
        return dbRes.rows[0];
    }
    catch (error) {
        console.error('get_VisitCountAndVisitLimit failed: ', error);
    }

}

async function setCurrentlyVisiting(user_id,avoid_place_id,bool_val){
    try {
        const sqlText = `
            UPDATE user_avoidplace
            SET currently_visiting = $3
            WHERE user_id = $1 AND avoid_place_id = $2
            ;`;
        const params = [user_id, avoid_place_id,bool_val];

        let dbRes = await pool.query(sqlText, params);
    }
    catch (error) {
        console.error('setCurrentlyVisiting failed: ', error);
    }
}

async function getCurrentlyVisiting(user_id,avoid_place_id){
    try {
        const sqlText = `
            SELECT currently_visiting FROM user_avoidplace
            WHERE user_id = $1 AND avoid_place_id = $2
            ;`;
        const params = [user_id, avoid_place_id];

        let dbRes = await pool.query(sqlText, params);
        //console.log(dbRes.rows[0].currently_visiting)
        return dbRes.rows[0].currently_visiting;
    }
    catch (error) {
        console.error('getCurrentlyVisiting failed: ', error);
    }
}

module.exports = {
    incrementVisitCount,
    resetVisitCount,
    get_VisitCountAndVisitLimit,
    setCurrentlyVisiting,
    getCurrentlyVisiting,
}