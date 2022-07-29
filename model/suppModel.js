// import pool
const pool = require('../utils/db')

// list Supplier
const listSupp = async () => {
    try {
        const allListSupp = await pool.query(`SELECT id_supp, nama, nama_toko, telp, alamat, status
        FROM public.supplier;`)
        return allListSupp.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// create supplier
const createSupp = async (nama,namaToko,telp,alamat,status) => {
    try {
        const addNewSup = await pool.query(`INSERT INTO public.supplier(
            nama, nama_toko, telp, alamat, status)
            VALUES ('${nama}', '${namaToko}', '${telp}', '${alamat}','${status}');`);
        return addNewSup
    } catch (error) {
        console.log(error.message);
    }
}

// handle detail supp
const detailSupp = async (idSupp) => {
    try {
        const detailSup = await pool.query(`SELECT id_supp, nama, nama_toko, telp, alamat, status
        FROM public.supplier WHERE id_supp = ${idSupp};`);
        return detailSup.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// handle detail transakski supplier
const detailTransaksiSupp = async (idSupp) => {
    try {
        const detailTransSupp = await pool.query(`SELECT  supp.nama_toko as supplier, 
        barang.nama as namaBarang,
        flow.id_transaksi as idTransaksi,
        flow.tanggal as tanggal,
        detailTrans.status as status,
        detailTrans.stok as stok,
        u.nama as employee
        FROM public.flow_transaksi flow LEFT JOIN public.detail_transaksi detailTrans ON flow.id_transaksi = detailTrans.id_transaksi
        LEFT JOIN public."user" u ON flow.id_user = u.id_user LEFT JOIN public.barang ON detailTrans.id_barang = barang.id_barang
        LEFT JOIN public.supplier supp ON flow.id_supp = supp.id_supp
        WHERE supp.id_supp = ${idSupp}
        ORDER BY tanggal DESC`)
        return detailTransSupp.rows;
    } catch (error) {
        console.log(error.message);
    }
}


// update detail supp
const updateSupp = async (idSupp,nama,namaToko,telp,alamat,status) => {
    try {
        const updateSup = await pool.query(`UPDATE public.supplier
        SET nama='${nama}', nama_toko='${namaToko}', telp='${telp}', alamat='${alamat}', status='${status}'
        WHERE id_supp = ${idSupp};`);
        return updateSup
    } catch (error) {
        console.log(error.message);
    }
}

// handle delete supp
const deleteSupp = async (idSupp) => {
    try {
        const deleteSup = await pool.query(`DELETE FROM public.supplier
        WHERE id_supp = ${idSupp};`);
        return deleteSup
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    listSupp,
    createSupp,
    detailSupp,
    updateSupp,
    deleteSupp,
    detailTransaksiSupp
}