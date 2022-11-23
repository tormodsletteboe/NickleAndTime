//send a message to this table everytime a user stays to long at a place, ie the user triggered an sms to be sent out

const pool = require('../modules/pool');

async function sendRecordToTrigger_SMS_table(user_id,avoid_place_id,message_id){
    try {
        const sqlText = `
            INSERT INTO trigger_sms (user_id,avoid_place_id,message_id)
            VALUES ($1,$2,$3)
        ;`;
        const params = [user_id,avoid_place_id,message_id];
        let dbRes = await pool.query(sqlText,params);
    } 
    catch (error) {
        console.error('getLocations_OfPlacesUserIsAvoiding failed',error);
    }
}

module.exports = {
    sendRecordToTrigger_SMS_table,
}