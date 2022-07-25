// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// import barang
const distri = require('../model/distriModel')
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

// handle all list distributor
exports.listDistri = async function (req,res) {
    const allDistriList = await distri.listDistri();
    res.render('distri-list', {
        title : 'List distributor',
        listDistri : allDistriList,
    }) 
}

// handle add new distributor
exports.addDistriView = async function(req,res) {
    res.render('distri-add', {
        title : 'Add new distributor',
        err : '',
    }) 
}

// handle create distributor (idDistri,nama,namaToko,telp,alamat)
exports.newDistri = async function (req,res) {
    const namaToko = req.body.namaToko;
    const nama = req.body.nama;
    const telp = req.body.telp;
    const alamat = req.body.alamat;
    const status = req.body.status;
    console.log(namaToko);
    console.log(nama);
    console.log(telp);
    console.log(alamat);
    await distri.createDistri(nama,namaToko,telp,alamat,status)
    res.redirect('/distributor')
}

// handle detail distributor
exports.detailDistri = async function(req,res) {
    const idDistri = req.params.idDistri;
    const detailDistri = (await distri.detailDistri(idDistri))[0];
    // console.log(detailDistri);
    res.render('Distri-detail', {
        title : "Detail distributor",
        detDistri : detailDistri,
    })
}

// handle update distributor view
exports.updateDistriView = async function (req,res) {
    const idDistri = req.body.idDistri;
    const detailDistri = (await distri.detailDistri(idDistri))[0];
    res.render('Distri-update-detail', {
        title : "Update distributor",
        detDistri : detailDistri,  
    })
}

// handle update distributor post
exports.updateDistriSend = async function (req,res) {
    const idDistri = req.body.idDistri
    const namaToko = req.body.namaToko;
    const nama = req.body.nama;
    const telp = req.body.telp;
    const alamat = req.body.alamat;
    const status = req.body.status;
    console.log(namaToko);
    console.log(nama);
    console.log(telp);
    console.log(alamat);
    await distri.updateDistri(idDistri,nama,namaToko,telp,alamat,status)
    res.redirect('/distributor')
}

// handle delete distributor post
exports.deleteDistri = async function (req,res) {
    const idDistri = req.body.idDistri;
    const detailDistri = (await distri.detailDistri(idDistri))[0];
    console.log(detailDistri);

    if (!detailDistri) {
        res.status(404)
        res.send(`id distributor of ${idDistri} not found!`)
    }else{
        await distri.deleteDistri(idDistri)
        res.redirect('/distributor')
    }
}