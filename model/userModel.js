// import pool
const pool = require('../utils/db')

// list user
const listUser = async () => {
    try {
        const allListUser = await pool.query(`SELECT id_user, nama, username, password, email, alamat, role, telp, status
        FROM public."user";`)
        return allListUser.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// create user username, password, email, role
const createUser = async (username, password, email, role, status) => {
    try {
        const addNewUser = await pool.query(`INSERT INTO public."user"(
            username, password, email, role, status)
            VALUES ('${username}', '${password}', '${email}', '${role}', '${status}');`);
        return addNewUser
    } catch (error) {
        console.log(error.message);
    }
}

// handle detail user
const detailUser = async (idUser) => {
    try {
        const detailUser = await pool.query(`SELECT id_user, nama, username, password, email, alamat, role, telp, status, image
        FROM public."user" WHERE id_user = ${idUser};`);
        return detailUser.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// update detail user
const updateUser = async (idUser,nama, username, email, alamat, telp, status) => {
    try {
        const updateUserr= await pool.query(`UPDATE public."user"
        SET nama='${nama}', username='${username}', email='${email}', alamat='${alamat}', telp='${telp}', status='${status}'
        WHERE id_user = ${idUser};`);
        return updateUserr
    } catch (error) {
        console.log(error.message);
    }
}

// update detail user 
const updateUserWithoutStatus = async (idUser,nama, username, password, email, alamat, telp, image) => {
    try {
        const updateUserr= await pool.query(`UPDATE public."user"
        SET nama='${nama}', username='${username}', password='${password}', email='${email}', alamat='${alamat}', telp='${telp}', image='${image}'
        WHERE id_user = ${idUser};`);
        return updateUserr
    } catch (error) {
        console.log(error.message);
    }
}

// handle delete user
const deleteUser = async (idUser) => {
    try {
        const deleteUserr = await pool.query(`DELETE FROM public."user"
        WHERE id_user = ${idUser};`);
        return deleteUserr
    } catch (error) {
        console.log(error.message);
    }
}

// handle reset password user
const resetPassword = async (idUser,hashPassword ) => {
    try {
        console.log(idUser);
        console.log(hashPassword);
        const resetPass = await pool.query(`UPDATE public."user"
        SET password = '${hashPassword}'
        WHERE id_user = ${idUser};`)
        return resetPass
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    listUser,
    createUser,
    detailUser,
    updateUser,
    deleteUser,
    resetPassword,
    updateUserWithoutStatus
}