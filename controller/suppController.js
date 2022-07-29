// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// import barang
const supp = require('../model/suppModel')
// call express library
const app = express();
// information using ejs
app.set('view engine', 'ejs')
// use express static for public folder
app.use(express.static('public'))
// use express layout
app.use(expressLayouts);
// set default layout for all routing
app.set('layout', 'layouts/main');

// handle all list supllier
exports.listSupp = async function (req,res) {
    const allSuppList = await supp.listSupp();
    res.render('supp-list', {
        title : 'List Supplier',
        listSupp : allSuppList,
    }) 
}

// handle add new supplier
exports.addSuppView = async function(req,res) {
    res.render('supp-add', {
        title : 'Add new supplier',
        err : '',
    }) 
}

// handle create supplier (idSupp,nama,namaToko,telp,alamat)
exports.newSupp = async function (req,res) {
    const namaToko = req.body.namaToko;
    const nama = req.body.nama;
    const telp = req.body.telp;
    const alamat = req.body.alamat;
    const status = 'open'
    console.log(namaToko);
    console.log(nama);
    console.log(telp);
    console.log(alamat);
    await supp.createSupp(nama,namaToko,telp,alamat,status)
    res.redirect('/supplier')
}

// handle detail supplier
exports.detailSupp = async function(req,res) {
    const idSupp = req.params.idSupp;
    const detailSup = (await supp.detailSupp(idSupp))[0];
    const detailTransSupp = await supp.detailTransaksiSupp(idSupp);
    // console.log(detailSup);
    res.render('supp-detail', {
        title : "Detail Supplier",
        detSupp : detailSup,
        detTransSupp : detailTransSupp
    })
}

// handle update supplier view
exports.updateSuppView = async function (req,res) {
    const idSupp = req.body.idSupp;
    const detailSup = (await supp.detailSupp(idSupp))[0];
    res.render('supp-update-detail', {
        title : "Update Supplier",
        detSupp : detailSup,  
    })
}

// handle update supplier post
exports.updateSuppSend = async function (req,res) {
    const idSupp = req.body.idSupp
    const namaToko = req.body.namaToko;
    const nama = req.body.nama;
    const telp = req.body.telp;
    const alamat = req.body.alamat;
    const status = req.body.status;
    console.log(namaToko);
    console.log(nama);
    console.log(telp);
    console.log(alamat);
    await supp.updateSupp(idSupp,nama,namaToko,telp,alamat,status)
    res.redirect('/supplier')
}

// handle delete supplier post
exports.deleteSupp = async function (req,res) {
    const idSupp = req.body.idSupp;
    const detailSup = (await supp.detailSupp(idSupp))[0];
    console.log(detailSup);

    if (!detailSup) {
        res.status(404)
        res.send(`id supplier of ${idSupp} not found!`)
    }else{
        await supp.deleteSupp(idSupp)
        res.redirect('/supplier')
    }
}