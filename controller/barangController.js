// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// import barang
const barang = require('../model/barangModel')
// call express library
const app = express();
// call multer library
const multer = require('multer')
// Import the filesystem module
const fs = require('fs');
// information using ejs
app.set('view engine', 'ejs')
// use express static for public folder
app.use(express.static('public'))
// use express layout
app.use(expressLayouts);
// set default layout for all routing
app.set('layout', 'layouts/main');

// handle all list barang
exports.listBarang = async function (req,res) {
    const allBarang = await barang.listBarang();
    res.render('barang-list', {
        title : 'List Barang',
        listBarang : allBarang,
        // layout : main,
    }) 
}

// handle add-barang view
exports.addBarangView = async function(req,res) {
    res.render('barang-add', {
        title : 'Add Barang',
        err : '',
    }) 
}

// handle create barang (namaBarang,stok,harga,kategori,image)
exports.newBarang = async function (req,res) {
    let image
    const findImgName = req.files.find((e) => e.filename)
    if (!findImgName) {
        image = 'default.png'
    }else{
        image = req.files[0].filename
    }
    // image = req.file[0].filename
    const nama = req.body.namaBarang;
    const stok = req.body.stok;
    const harga = req.body.harga;
    const kategori = req.body.kategori;
    console.log(nama);
    console.log(stok);
    console.log(harga);
    console.log(kategori);
    console.log(image);
    await barang.createBarang(nama,stok,harga,kategori,image)
    res.redirect('/barang')
}

// handle detail Barang
exports.detailBarang = async function(req,res) {
    const idBarang = req.params.idBarang;
    const detailBar = (await barang.detailBarangWithStok(idBarang))[0];
    console.log(detailBar);
    res.render('barang-detail', {
        title : "Detail Barang",
        detBarang : detailBar,
    })
}

// handle update barang view
exports.updateBarangView = async function (req,res) {
    const idBarang = req.body.idBarang;
    const detailBar = (await barang.detailBarangWithoutStok(idBarang))[0]
    res.render('barang-update-detail', {
        title : "Update Barang",
        detBarang : detailBar,  
    })
}

// handle update barang post
exports.updateBarangSend = async function (req,res) {
    const idBarang = req.body.idBarang;
    const nama = req.body.namaBarang;
    const harga = req.body.harga;
    const kategori = req.body.kategori;
    const imageBarang = req.body.imageBarang;
    console.log(nama);
    console.log(harga);
    console.log(kategori);
    await barang.updateBarang(idBarang,nama,harga,kategori)
    res.redirect('/barang')
}

// handle delete barang post
exports.deleteBarang = async function (req,res) {
    const idBarang = req.body.idBarang;
    const detBarang = (await barang.detailBarangWithoutStok(idBarang))[0]

    if (!detBarang) {
        res.status(404)
        res.send(`id product of ${idBarang} not found!`)
    }else{
        fs.unlink('public/images/'+detBarang.image, (err => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted file: "+detBarang.image);
            
            }
          }))
        await barang.deleteBarang(idBarang)
        res.redirect('/barang')
    }
}