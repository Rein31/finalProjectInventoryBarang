// import pool
const pool = require('../utils/db')

// list distributor
const listDistri = async () => {
    try {
        const allListDistri = await pool.query(`SELECT id_distri, nama, nama_toko, telp, alamat, status
        FROM public.distributor;`)
        return allListDistri.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// create distributor
const createDistri = async (nama,namaToko,telp,alamat,status) => {
    try {
        const addNewDistri = await pool.query(`INSERT INTO public.distributor(
            nama, nama_toko, telp, alamat, status)
            VALUES ('${nama}', '${namaToko}', '${telp}', '${alamat}', '${status}');`);
        return addNewDistri
    } catch (error) {
        console.log(error.message);
    }
}

// handle detail distributor
const detailDistri = async (idDistri) => {
    try {
        const detailDistrit = await pool.query(`SELECT id_distri, nama, nama_toko, telp, alamat, status
        FROM public.distributor WHERE id_distri = ${idDistri};`);
        return detailDistrit.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// update detail distributor
const updateDistri = async (idDistri,nama,namaToko,telp,alamat,status) => {
    try {
        const updateDistrit = await pool.query(`UPDATE public.distributor
        SET nama='${nama}', nama_toko='${namaToko}', telp='${telp}', alamat='${alamat}', status='${status}'
        WHERE id_distri = ${idDistri};`);
        return updateDistrit
    } catch (error) {
        console.log(error.message);
    }
}

// handle delete distributor
const deleteDistri = async (idDistri) => {
    try {
        const deleteDistrit = await pool.query(`DELETE FROM public.distributor
        WHERE id_distri = ${idDistri};`);
        return deleteDistrit
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    listDistri,
    createDistri,
    detailDistri,
    updateDistri,
    deleteDistri,
}