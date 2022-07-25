// import pool
const pool = require('../utils/db')

// list transaksi
const listTrans = async () => {
    try {
        const allListTrans = await pool.query(`SELECT trans.id_transaksi, trans.tanggal, trans.status_transaksi,  supp.nama_toko as namaSupp, distri.nama_toko as namaDistri, u.nama
        FROM public.flow_transaksi trans LEFT JOIN supplier supp ON trans.id_supp = supp.id_supp 
        LEFT JOIN distributor distri ON trans.id_distri = distri.id_distri
        LEFT JOIN public."user" u on trans.id_user = u.id_user;`)
        // console.log(allListTrans);
        return allListTrans.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// create transaksi
const createTrans = async (tanggal,status,namaToko,namaEmp,namaBarang,jumStok) => {
    try {
        let findCompanyByName;
        let addBarangToDetailTrans;
        let addNewTrans;
        let idBarang
        let findBarangByName
        let updateStokBarang
        let findEmpByName = await pool.query(`SELECT id_user FROM public."user" WHERE nama LIKE '%${namaEmp}%';`)
        let idUser = findEmpByName.rows[0];
        let createIdTrans = (await pool.query(`SELECT max(id_transaksi) as id_trans FROM public.flow_transaksi`)).rows[0]
        let idTrans=0;
        console.log(createIdTrans.id_trans);
        if (createIdTrans === undefined) {
            idTrans = 1;
        } else {
            idTrans = createIdTrans.id_trans + 1;
            // console.log(idTrans);
        }
        
        if (status === 'in') {
            findCompanyByName = await pool.query(`SELECT id_supp FROM public.supplier
            WHERE nama_toko LIKE '%${namaToko}%';`);
            idComp = findCompanyByName.rows[0];

            addNewTrans = await pool.query(`INSERT INTO public.flow_transaksi(
                id_transaksi, tanggal, status_transaksi, id_supp, id_user)
                VALUES (${idTrans},NOW(), '${status}', ${idComp.id_supp}, ${idUser.id_user});`);

            namaBarang.forEach( async (e,i=0 )=> {
                // query find id barang by name
                findBarangByName = await pool.query(`SELECT id_barang, stok FROM public.barang
                WHERE nama LIKE '%${e}%';`);
                barang = findBarangByName.rows[0];
                console.log(barang);
                addBarangToDetailTrans = await pool.query(`INSERT INTO public.detail_transaksi(
                    id_transaksi, tanggal, id_barang, nama_barang, stok, status)
                    VALUES (${idTrans}, NOW(), ${barang.id_barang}, '${e}', ${jumStok[i]}, '${status}');`)
                let jumStokNew = parseInt(barang.stok) + parseInt(jumStok[i])
                updateStokBarang = await pool.query(`UPDATE public.barang
                SET stok='${jumStokNew}'
                WHERE id_barang='${barang.id_barang}';`)
                i++;
            });
        } else if (status === 'out') {
            findCompanyByName = await pool.query(`SELECT id_distri FROM public.distributor
            WHERE nama_toko LIKE '%${namaToko}%';`);
            idComp = findCompanyByName.rows[0];

            addNewTrans = await pool.query(`INSERT INTO public.flow_transaksi(
                id_transaksi, tanggal, status_transaksi, id_distri, id_user)
                VALUES (${idTrans},NOW(), '${status}', ${idComp.id_distri}, ${idUser.id_user});`);

            namaBarang.forEach( async (e,i=0 )=> {
                // query find id barang by name
                findBarangByName = await pool.query(`SELECT id_barang, stok FROM public.barang
                WHERE nama LIKE '%${e}%';`);
                barang = findBarangByName.rows[0];
                console.log(barang);
                console.log(barang.id_barang);
                addBarangToDetailTrans = await pool.query(`INSERT INTO public.detail_transaksi(
                    id_transaksi, tanggal, id_barang, nama_barang, stok, status)
                    VALUES (${idTrans}, NOW(), ${barang.id_barang}, '${e}', ${jumStok[i]}, '${status}');`)
                if (jumStok[i] > barang.stok) {
                    return false;
                }
                let jumStokNew = parseInt(barang.stok) - parseInt(jumStok[i])
                updateStokBarang = await pool.query(`UPDATE public.barang
                SET stok='${jumStokNew}'
                WHERE id_barang='${barang.id_barang}';`)
                i++;
            });
        }
        return addNewTrans,addBarangToDetailTrans
    } catch (error) {
        console.log(error.message);
    }
}

// handle detail transaksi
const detailTrans = async (idTrans) => {
    try {
        const detailTrans = await pool.query(`SELECT * FROM public.detail_transaksi
        WHERE id_transaksi = '${idTrans}' ORDER BY id_detail_transaksi ASC `);
        return detailTrans.rows;
    } catch (error) {
        console.log(error.message);
    }
}

// update detail transaksi
// const updateTrans = async () => {
//     try {
//         const updateTran = await pool.query(``);
//         return updateTran
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// handle check id transaksi
const checkIdTrans = async (idTrans) => {
    try {
        const checkId = await pool.query(`SELECT * FROM public.flow_transaksi
        WHERE id_transaksi = ${idTrans};`);
        return checkId
    } catch (error) {
        console.log(error.message);
    }
}

// handle delete detail taransaksi
const deleteDetailTrans = async (idTrans) => {
    try {
        const deleteDetTrans = await pool.query(`DELETE FROM public.detail_transaksi
        WHERE id_transaksi = ${idTrans};`);
        return deleteDetTrans
    } catch (error) {
        console.log(error.message);
    }
}

// handle delete transaksi
const deleteTrans = async (idTrans) => {
    try {
        const deleteTrans = await pool.query(`DELETE FROM public.flow_transaksi
        WHERE id_transaksi = ${idTrans};`);
        return deleteTrans
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    listTrans,
    createTrans,
    detailTrans,
    // updateTrans,
    checkIdTrans,
    deleteDetailTrans,
    deleteTrans
}