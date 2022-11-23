
const pool = require('../modules/pool');
//get a random message based on severity rating
async function getMessage(severity) {
    try {
        const sqlText = `
            SELECT * FROM messages
            WHERE severity = $1
            ORDER BY RANDOM()
            LIMIT 1
        ;`;
        const params = [severity];
        let dbRes = await pool.query(sqlText, params);
        //console.log('dbRes',dbRes);
        return dbRes.rows[0].body;
    }
    catch (error) {
        console.error('error in getMessage', error);
    }

}

module.exports = {
    getMessage,
}
