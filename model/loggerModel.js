const pool = require('../utils/db')

// add Log
const loggerNoted = async (method, url,username,nama,role) => {
    try {
        const addNewLog = await pool.query(`INSERT INTO public.applog(
            method, url, username, name, role)
            VALUES ('${method}', '${url}', '${username}', '${nama}', '${role}');`);
        return addNewLog
    } catch (error) {
        console.log(error.message);
    }
}

// list log
const listLog = async () => {
    try {
        const listLogger = await pool.query(`SELECT method, url, username, role, time
        FROM public.applog ORDER BY time ASC;`)
        return listLogger.rows
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {loggerNoted, listLog}