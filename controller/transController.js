// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// import transaksi
const trans = require('../model/transModel')
// call express library
const app = express();
// call dayjs library
const dayjs = require('dayjs')
// information using ejs
app.set('view engine', 'ejs')
// use express static for public folder
app.use(express.static('public'))
// use express layout
app.use(expressLayouts);
// set default layout for all routing
app.set('layout', 'layouts/main');

// handle all list transaksi
exports.listTrans = async function (req,res) {
    const allTrans = await trans.listTrans();
    res.render('trans-list', {
        title : 'List Transaksi',
        listTrans : allTrans,
        // layout : main,
    }) 
}

// handle add-transaksi view
exports.addTransView = async function(req,res) {
    res.render('trans-add', {
        title : 'Add Transaksi',
        err : '',
    }) 
}

// handle create transaksi
exports.newTrans = async function (req,res) {
    let tanggal = new Date(req.body.tanggal);
    const status = req.body.status;
    const namaToko = req.body.namaToko;
    const namaEmp = req.body.namaEmp;
    const namaBarang = req.body.namaBarang;
    const jumStok = req.body.jumStok;
    // console.log(status);
    // console.log(namaToko);
    console.log(namaBarang);
    console.log(jumStok);
    // namaBarang.forEach((e,i=0 )=> {
    //     console.log(`barang = ${e}, qty ${jumStok[i]}`);
    //     i++;
    // });
    console.log(tanggal.toLocaleDateString());
    await trans.createTrans(tanggal,status,namaToko,namaEmp,namaBarang,jumStok)
    res.redirect('/transaksi')
}

// handle detail transaksi
exports.detailTrans = async function(req,res) {
    const idTrans = req.params.idTrans;
    const detailTrans = await trans.detailTrans(idTrans);
    console.log(detailTrans);
    res.render('trans-detail', {
        title : "Detail Transaksi",
        detTrans : detailTrans,
    })
}

// handle update transaksi view
// exports.updateTransView = async function (req,res) {
//     const idTrans = req.body.idTrans;
//     const detailTrans = (await Trans.detailTrans(idTrans))[0]
//     res.render('trans-update-detail', {
//         title : "Update Transaksi",
//         detTrans : detailTrans,  
//     })
// }

// handle update transaksi post
// exports.updateTransSend = async function (req,res) {
//     const idTrans = req.body.idTrans;
//     const nama = req.body.namaTrans;
//     const harga = req.body.harga;
//     const kategori = req.body.kategori;
//     console.log(nama);
//     console.log(harga);
//     console.log(kategori);
//     await trans.updateTrans(idTrans,nama,harga,kategori)
//     res.redirect('/transaksi')
// }

// handle delete transaksi post
exports.deleteTrans = async function (req,res) {
    const idTrans = req.body.idTrans;
    const detTrans = (await trans.checkIdTrans(idTrans))
    // console.log(detTrans);

    if (!detTrans) {
        res.status(404)
        res.send(`id transaksi of ${idTrans} not found!`)
    }else{
        await trans.deleteDetailTrans(idTrans)
        await trans.deleteTrans(idTrans)
        res.redirect('/transaksi')
    }
}