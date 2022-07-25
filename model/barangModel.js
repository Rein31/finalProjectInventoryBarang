// import pool
const pool = require('../utils/db')

// list Barang
const listBarang = async () => {
    try {
        const allListBarang = await pool.query(`SELECT id_barang, nama, stok, harga, kategori, image
        FROM public.barang;`)
        return allListBarang.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// create barang
const createBarang = async (namaBarang,stok,harga,kategori,image) => {
    try {
        const addNewBarang = await pool.query(`INSERT INTO public.barang(
            nama, stok, harga, kategori, image)
            VALUES ('${namaBarang}',${stok},${harga},'${kategori}','${image}');`);
        return addNewBarang
    } catch (error) {
        console.log(error.message);
    }
}

// handle detail barang without stock
const detailBarangWithoutStok = async (idBarang) => {
    try {
        const detailBarangWithoutStock = await pool.query(`SELECT id_barang, nama, harga, kategori, image
        FROM public.barang where id_barang = ${idBarang};`);
        return detailBarangWithoutStock.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// handle detail barang with stock
const detailBarangWithStok = async (idBarang) => {
    try {
        const detailBarangWithoutStock = await pool.query(`SELECT id_barang, nama, stok, harga, kategori, image
        FROM public.barang where id_barang = ${idBarang};`);
        return detailBarangWithoutStock.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// update detail barang
const updateBarang = async (idBarang,namaBarang,harga,kategori) => {
    try {
        const updateBar = await pool.query(`UPDATE public.barang
        SET nama='${namaBarang}', harga='${harga}', kategori='${kategori}' image='${image}'
        WHERE id_barang = ${idBarang};`);
        return updateBar
    } catch (error) {
        console.log(error.message);
    }
}

// handle delete barang
const deleteBarang = async (idBarang) => {
    try {
        const deleteBar = await pool.query(`DELETE FROM public.barang
        WHERE id_barang = ${idBarang};`);
        return deleteBar
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    listBarang,
    createBarang,
    updateBarang,
    detailBarangWithStok,
    detailBarangWithoutStok,
    deleteBarang,
    
}