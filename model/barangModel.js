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
        const detailBarangWithStock = await pool.query(`SELECT id_barang, nama, stok, harga, kategori, image
        FROM public.barang where id_barang = ${idBarang};`);
        return detailBarangWithStock.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// handle detail barang tansaksi
const detailBarangTransaksi = async (idBarang) => {
    try {
        const detailBarangTrans = await pool.query(`SELECT barang.nama as namaBarang,
        flow.id_transaksi as idTransaksi,
        flow.tanggal as tanggal,
        detailTrans.status as status,
        detailTrans.stok as stok,
        distri.nama_toko as Distributor,
        supp.nama_toko as Supplier,
        u.nama as employee
        FROM public.flow_transaksi flow LEFT JOIN public.detail_transaksi detailTrans ON flow.id_transaksi = detailTrans.id_transaksi
        LEFT JOIN public."user" u ON flow.id_user = u.id_user LEFT JOIN public.barang ON detailTrans.id_barang = barang.id_barang
        LEFT JOIN public.distributor distri ON flow.id_distri = distri.id_distri LEFT JOIN public.supplier supp ON flow.id_supp = supp.id_supp
        WHERE barang.id_barang = ${idBarang}
        ORDER BY tanggal DESC`);
        return detailBarangTrans.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// update detail barang
const updateBarang = async (idBarang,namaBarang,harga,kategori,image) => {
    try {
        const updateBar = await pool.query(`UPDATE public.barang
        SET nama='${namaBarang}', harga='${harga}', kategori='${kategori}', image='${image}'
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

const addNewKategori = async (newKategori) => {
    try {
        const addNewKategorii = await pool.query(`INSERT INTO public.kategori_barang(
            nama_kategori)
            VALUES ('${newKategori}');`);
        return addNewKategorii
    } catch (error) {
        console.log(error.message);
    }
}

const listKategori = async () => {
    try {
        const listKategorii = await pool.query(`SELECT id_kategori, nama_kategori
        FROM public.kategori_barang;`);
        return listKategorii.rows;
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
    addNewKategori,
    listKategori,
    detailBarangTransaksi
    
}