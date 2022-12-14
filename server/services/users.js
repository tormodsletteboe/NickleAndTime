const pool = require('../modules/pool');

//get all users
async function getUsers() {
    try {
        let dbRes = await pool.query(`SELECT * FROM "user";`);
       
        return dbRes.rows;
    } 
    catch (error) {
        console.error('getUsers failed',error);
    }

}

//get user name
async function getUserName(user_id) {
    try {
        const sqlText = `
            SELECT username FROM "user" WHERE id=$1
        ;`;
        const params =[user_id];
        let dbRes = await pool.query(sqlText,params);
        
        return dbRes.rows[0].username;
    } 
    catch (error) {
        console.error('getUserName failed',error);
    }

}

//get user phone number
async function getUserPhoneNumber(user_id) {
    try {
        const sqlText = `
            SELECT phone_number FROM "user" WHERE id=$1
        ;`;
        const params =[user_id];
        let dbRes = await pool.query(sqlText,params);
       
        return dbRes.rows[0].phone_number;
    } 
    catch (error) {
        console.error('getUserPhoneNumber failed',error);
    }

}

//get the current location of several users
async function getUsersLocation(){
    try {
        let dbRes = await pool.query(`SELECT * FROM "user_location";`);
       
        return dbRes.rows;
    } 
    catch (error) {
        console.error('getUsersLocations failed',error);
    }
}

async function getUser_Location(user_id){
    try {
        let dbRes = await pool.query(`SELECT current_latitude,current_longitude FROM "user_location" WHERE user_id=$1;`,[user_id]);
        return dbRes.rows[0];
    } 
    catch (error) {
        console.error('getUser_Location failed',error);
    }
}

//find places that this user is avoiding
async function getLocations_OfPlacesUserIsAvoiding(user_id){
    try {
        const sqlText = `
        SELECT 
            avoid_place.latitude,
            avoid_place.longitude,
            avoid_place.name,
            avoid_place.id
        FROM "user_avoidplace"
        LEFT JOIN avoid_place ON avoid_place.id = user_avoidplace.avoid_place_id
        WHERE user_avoidplace.user_id = $1 AND user_avoidplace.active = TRUE
        ;`;
        const params = [user_id];
        let dbRes = await pool.query(sqlText,params);
        
        return dbRes.rows;
    } 
    catch (error) {
        console.error('getLocations_OfPlacesUserIsAvoiding failed',error);
    }
}
module.exports = { 
    getUsers,
    getUserName,
    getUserPhoneNumber,
    getUsersLocation,
    getUser_Location,
    getLocations_OfPlacesUserIsAvoiding,
 };